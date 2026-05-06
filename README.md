# esql-syntax

TextMate grammar for [ES|QL](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql.html) (Elasticsearch Query Language), distributed as:

- **VS Code extension** — [VS Code Marketplace](https://marketplace.visualstudio.com/) · [Open VSX](https://open-vsx.org/)
- **IntelliJ plugin** — [JetBrains Marketplace](https://plugins.jetbrains.com/)

## Project layout

```text
syntaxes/
└── esql.tmLanguage.json               # Canonical grammar (edit here)

extensions/
├── vscode/                            # VS Code extension
└── intellij/                          # IntelliJ plugin wrapper

scripts/
└── validate-grammar.js                # Validates alternation ordering

samples/
└── example.esql                       # Sample queries for manual testing
```

## Installation

### VS Code

- Search for "ESQL Syntax" in the [VS Code Marketplace](https://marketplace.visualstudio.com/) or [Open VSX](https://open-vsx.org/).
- Or download the latest `.vsix` from [GitHub Releases](https://github.com/elastic/esql-syntax/releases) and run **Extensions: Install from VSIX...**.

### IntelliJ

- Search for "ESQL Syntax" in **Settings** > **Plugins** > **Marketplace**.
- Or download the latest plugin ZIP from [GitHub Releases](https://github.com/elastic/esql-syntax/releases) and use **Install Plugin from Disk...**.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE.txt).
