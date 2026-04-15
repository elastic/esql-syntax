# esql-syntax

TextMate grammar for [ES|QL](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql.html) (Elasticsearch Query Language), distributed as:

- **VS Code extension** — [extensions/vscode/](extensions/vscode/)
- **IntelliJ plugin** — [extensions/intellij/](extensions/intellij/)

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE.txt).
