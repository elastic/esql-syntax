# ESQL Syntax

Syntax highlighting for [ES|QL](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql.html) (Elasticsearch Query Language) for IntelliJ-based IDEs, using the bundled TextMate grammar from this repository.

## Local development

1. Regenerate the grammar at repo root:

   ```bash
   npm run generate
   ```

2. From this directory, run the plugin in a sandbox IDE:

   ```bash
   ./gradlew runIde
   ```

3. Or build a distributable ZIP:

   ```bash
   ./gradlew buildPlugin
   ```

The generated plugin ZIP will be available under `build/distributions/`.
