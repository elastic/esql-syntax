# esql-syntax

TextMate grammar for [ES|QL](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql.html) (Elasticsearch Query Language), distributed as:

- **VS Code extension** — [extensions/vscode/](extensions/vscode/)
- **IntelliJ plugin** — [extensions/intellij/](extensions/intellij/)
- **GitHub Linguist** — [extensions/github/esql.tmLanguage.json](extensions/github/esql.tmLanguage.json)

## Project layout

```
src/
├── esql-data.js                       # Keyword lists (edit to add commands)
├── esql.tmLanguage.template.json      # Grammar template with placeholders
└── generate.js                        # Substitutes placeholders → writes grammar

extensions/
├── github/esql.tmLanguage.json        # Canonical grammar (used by Linguist + plugins)
├── vscode/                            # VS Code extension
└── intellij/                          # IntelliJ plugin wrapper around the same grammar
```

## Add a new command or function

1. Edit [`src/esql-data.js`](src/esql-data.js) and add the name to the appropriate array
2. Run `npm run generate`
3. Commit both files

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contributor guide.

## License

MIT — see [LICENSE](LICENSE.txt).
