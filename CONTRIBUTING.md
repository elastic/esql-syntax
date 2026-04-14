# Contributing

## Add a command, function, or operator

1. Edit [`src/esql-data.js`](src/esql-data.js) — add the name to the relevant array
2. Commit — a pre-commit hook regenerates `extensions/github/esql.tmLanguage.json` and stages it automatically

## Test locally

```bash
npm run generate
cd extensions/vscode && npx @vscode/vsce package
code --install-extension esql-*.vsix
```

## Test the IntelliJ plugin locally

```bash
npm run generate
cd extensions/intellij
./gradlew runIde
```
