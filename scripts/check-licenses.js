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
 * Verifies that any runtime dependencies bundled into the VS Code
 * extension use a license from the approved allowlist. Skips quickly
 * when there are no runtime dependencies (the current state).
 */

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VSCODE_DIR = join(__dirname, "..", "extensions", "vscode");

const ALLOWED = [
  "Apache-2.0",
  "MIT",
  "BSD-3-Clause",
  "BSD-2-Clause",
  "ISC",
  "BlueOak-1.0.0",
];

const pkg = JSON.parse(readFileSync(join(VSCODE_DIR, "package.json"), "utf-8"));
const deps = Object.keys(pkg.dependencies || {});

if (deps.length === 0) {
  console.log("No runtime dependencies — license check skipped.");
  process.exit(0);
}

try {
  execSync("npm install --omit=dev --no-audit --no-fund", {
    cwd: VSCODE_DIR,
    stdio: "inherit",
  });
  execSync(
    `npx --yes license-checker --production --onlyAllow "${ALLOWED.join(";")}"`,
    { cwd: VSCODE_DIR, stdio: "inherit" }
  );
} catch {
  process.exit(1);
}
