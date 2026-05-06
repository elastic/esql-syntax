#!/usr/bin/env node

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Validates esql.tmLanguage.json:
 *
 * 1. JSON is valid and has the expected TextMate structure
 * 2. Alternations in regex patterns are ordered longest-first,
 *    so that multi-word entries (e.g. "LEFT JOIN") are matched
 *    before their prefixes (e.g. "LEFT").
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GRAMMAR_PATH = join(__dirname, "..", "syntaxes", "esql.tmLanguage.json");

let grammar;
try {
  grammar = JSON.parse(readFileSync(GRAMMAR_PATH, "utf-8"));
} catch (err) {
  console.error(`Failed to parse grammar: ${err.message}`);
  process.exit(1);
}

// Basic structure checks
const required = ["name", "scopeName", "patterns", "repository"];
for (const key of required) {
  if (!(key in grammar)) {
    console.error(`Missing required top-level key: "${key}"`);
    process.exit(1);
  }
}

// Extract alternations from regex patterns and validate ordering
const errors = [];

function extractAlternations(regex) {
  // Match the non-capturing alternation group: (?:...) — skip (?i) flag
  const match = regex.match(/\(\?:((?:[^()]+|\([^()]*\))*)\)/);
  if (!match) return null;
  return match[1].split("|");
}

function normalizeAlt(alt) {
  // Replace \s+ with space for length comparison
  return alt.replace(/\\s\+/g, " ").replace(/\\\\/g, "\\");
}

function checkOrdering(ruleName, regex) {
  const alts = extractAlternations(regex);
  if (!alts || alts.length < 2) return;

  for (let i = 0; i < alts.length - 1; i++) {
    const current = normalizeAlt(alts[i]);
    const next = normalizeAlt(alts[i + 1]);

    if (current.length < next.length) {
      errors.push(
        `[${ruleName}] "${alts[i]}" (${current.length} chars) comes before ` +
        `"${alts[i + 1]}" (${next.length} chars) — longest-first ordering violated`
      );
    }
  }
}

// Walk all rules in the repository — only check case-insensitive
// word-bounded patterns (keyword/command alternations).
for (const [name, rule] of Object.entries(grammar.repository)) {
  if (rule.match && rule.match.startsWith("(?i)\\b")) {
    checkOrdering(name, rule.match);
  }
  if (rule.patterns) {
    for (const pattern of rule.patterns) {
      if (pattern.match && pattern.match.startsWith("(?i)\\b")) {
        checkOrdering(name, pattern.match);
      }
    }
  }
}

if (errors.length > 0) {
  console.error("Grammar validation failed:\n");
  for (const err of errors) {
    console.error(`  ✗ ${err}`);
  }
  console.error(`\n${errors.length} error(s) found.`);
  process.exit(1);
}

console.log("Grammar validation passed.");
