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
 * Validates the TextMate grammar files:
 *
 * 1. Every syntaxes/*.tmLanguage.json file parses as JSON.
 * 2. esql.tmLanguage.json has the expected TextMate structure
 *    and alternations are ordered longest-first.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYNTAXES_DIR = join(__dirname, "..", "syntaxes");
const CORE_GRAMMAR = "esql.tmLanguage.json";

const errors = [];
const grammarFiles = readdirSync(SYNTAXES_DIR).filter((f) => f.endsWith(".tmLanguage.json"));

let coreGrammar;
for (const file of grammarFiles) {
  const path = join(SYNTAXES_DIR, file);
  try {
    const content = JSON.parse(readFileSync(path, "utf-8"));
    if (file === CORE_GRAMMAR) coreGrammar = content;
  } catch (err) {
    errors.push(`[${file}] Failed to parse: ${err.message}`);
  }
}

if (!coreGrammar) {
  console.error(`Failed to load core grammar: ${CORE_GRAMMAR}`);
  process.exit(1);
}

// Core grammar structure checks
const required = ["name", "scopeName", "patterns", "repository"];
for (const key of required) {
  if (!(key in coreGrammar)) {
    errors.push(`[${CORE_GRAMMAR}] Missing required top-level key: "${key}"`);
  }
}

function extractAlternations(regex) {
  const match = regex.match(/\(\?:((?:[^()]+|\([^()]*\))*)\)/);
  if (!match) return null;
  return match[1].split("|");
}

function normalizeAlt(alt) {
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
        `[${CORE_GRAMMAR}:${ruleName}] "${alts[i]}" (${current.length} chars) comes before ` +
        `"${alts[i + 1]}" (${next.length} chars) — longest-first ordering violated`
      );
    }
  }
}

// Longest-first check: only case-insensitive word-bounded patterns in the core grammar
for (const [name, rule] of Object.entries(coreGrammar.repository || {})) {
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

console.log(`Grammar validation passed (${grammarFiles.length} files).`);
