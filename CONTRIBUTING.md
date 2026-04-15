# Contributing

## Add a command, function, or operator

1. Edit [`syntaxes/esql.tmLanguage.json`](syntaxes/esql.tmLanguage.json) — add the name to the relevant regex alternation
2. Keep entries ordered **longest-first** (multi-word entries like `LEFT\s+JOIN` must come before `LEFT`)
3. Optionally run `node scripts/validate-grammar.js` to verify ordering locally
4. Commit — CI validates the ordering automatically

## Test locally

### VS Code

```bash
cd extensions/vscode && npx @vscode/vsce package
code --install-extension esql-*.vsix
```

### IntelliJ

```bash
cd extensions/intellij
./gradlew runIde
```
