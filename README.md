# esql-syntax

Syntax highlighting for [ES|QL](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql.html) (Elasticsearch Query Language) queries in `.esql` files, distributed as:

- **VS Code extension** — [VS Code Marketplace](https://marketplace.visualstudio.com/) · [Open VSX](https://open-vsx.org/)
- **IntelliJ plugin** — [JetBrains Marketplace](https://plugins.jetbrains.com/)
- **TextMate / Sublime Text / other editors** — `esql.tmLanguage` in [GitHub Releases](https://github.com/elastic/esql-syntax/releases)

## Project layout

```text
syntaxes/
├── esql.tmLanguage.json               # Canonical grammar (edit here)
└── esql.tmLanguage                    # Generated XML — run: npm run build

extensions/
├── vscode/                            # VS Code extension
└── intellij/                          # IntelliJ plugin wrapper

scripts/
├── validate-grammar.js                # Validates alternation ordering
└── json-to-xml.js                     # Converts grammar JSON → XML plist

samples/
└── example.esql                       # Sample queries for manual testing
```

## Installation

### VS Code

- Search for "Highlight ES|QL" in the [VS Code Marketplace](https://marketplace.visualstudio.com/) or [Open VSX](https://open-vsx.org/).
- Or download the latest `.vsix` from [GitHub Releases](https://github.com/elastic/esql-syntax/releases) and run **Extensions: Install from VSIX...**.

### IntelliJ

- Search for "Highlight ES|QL" in **Settings** > **Plugins** > **Marketplace**.
- Or download the latest plugin ZIP from [GitHub Releases](https://github.com/elastic/esql-syntax/releases) and use **Install Plugin from Disk...**.

## Development

After editing `syntaxes/esql.tmLanguage.json`, regenerate the XML and commit both files:

```bash
npm run build
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Apache 2.0 — see [LICENSE](LICENSE.txt).
