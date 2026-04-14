#!/usr/bin/env node

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

/**
 * Generates esql.tmLanguage.json by substituting placeholders in the
 * template with regex alternations built from esql-data.js.
 *
 * Template: src/esql.tmLanguage.template.json
 * Data:     src/esql-data.js
 * Output:   extensions/github/esql.tmLanguage.json (also the Linguist distribution file)
 *
 * To add a command, function or operator: edit src/esql-data.js and
 * re-run this script. To change grammar structure (new pattern, scope
 * rename, etc.): edit the template JSON directly.
 *
 * Usage: node src/generate.js
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
	binaryNamedOperators,
	functions,
	headerCommands,
	literals,
	options,
	otherNamedOperators,
	processingCommands,
	sourceCommands,
	temporalUnits,
} from "./esql-data.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const TEMPLATE_PATH = join(ROOT, "src", "esql.tmLanguage.template.json");
const OUTPUT_PATH = join(ROOT, "extensions", "github", "esql.tmLanguage.json");

// ---------------------------------------------------------------------------
// Regex helpers
// ---------------------------------------------------------------------------

function sortLongestFirst(words) {
	return words.slice().sort((wordA, wordB) => wordB.length - wordA.length);
}

function escapeForRegex(word) {
	return word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
}

/**
 * Case-insensitive, word-bounded, non-capturing alternation.
 * Multi-word entries (with spaces) use \s+ so they match in a single
 * alternation alongside single-word entries (sorted longest-first so that
 * "LEFT JOIN" is tried before "LEFT").
 */
function wordPattern(words) {
	const alts = sortLongestFirst(words).map(escapeForRegex);

	return `(?i)\\b(?:${alts.join("|")})\\b`;
}

/** Same as wordPattern, but with a capturing group and no trailing \b. */
function capturingWordPattern(words) {
	const alts = sortLongestFirst(words).map(escapeForRegex);

	return `(?i)\\b(${alts.join("|")})`;
}

/** Turns a JS string into its JSON string-value form (without surrounding quotes). */
function toJsonStringValue(str) {
	return JSON.stringify(str).slice(1, -1);
}

// ---------------------------------------------------------------------------
// Compute dynamic patterns
// ---------------------------------------------------------------------------

const DIGITS = "\\d+(_+\\d+)*";
const namedOps = [...binaryNamedOperators, ...otherNamedOperators];
const timeUnitsAlt = sortLongestFirst(temporalUnits.flat()).join("|");

const placeholders = {
	"{{SOURCE_COMMANDS}}": wordPattern(sourceCommands),
	"{{PROCESSING_COMMANDS}}": wordPattern(processingCommands),
	"{{HEADER_COMMANDS}}": wordPattern(headerCommands),
	"{{OPTIONS}}": wordPattern(options),
	"{{NAMED_OPERATORS}}": wordPattern(namedOps),
	"{{LITERALS}}": wordPattern(literals),
	"{{FUNCTION_CALL}}": `${capturingWordPattern(functions)}\\s*(\\()`,
	"{{TIME_INTERVAL}}": `(?i)\\b${DIGITS}\\s*(?:${timeUnitsAlt})\\b`,
};

// ---------------------------------------------------------------------------
// Substitute and write
// ---------------------------------------------------------------------------

let template = readFileSync(TEMPLATE_PATH, "utf-8");

for (const [placeholder, regex] of Object.entries(placeholders)) {
	if (!template.includes(placeholder)) {
		throw new Error(`Placeholder ${placeholder} not found in template`);
	}

	template = template.replaceAll(placeholder, toJsonStringValue(regex));
}

// Validate by parsing, then re-serialize with consistent formatting
const grammar = JSON.parse(template);
const jsonOutput = `${JSON.stringify(grammar, null, "\t")}\n`;

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, jsonOutput, "utf-8");

const commandCount =
	headerCommands.length + sourceCommands.length + processingCommands.length;

console.log(`Generated: ${OUTPUT_PATH}`);
console.log(
	`  ${commandCount} commands, ${functions.length} functions, ${namedOps.length} named operators`
);
