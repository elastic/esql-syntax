package co.elastic.esqlsyntax.intellij;

import com.intellij.openapi.application.PathManager;
import org.jetbrains.plugins.textmate.api.TextMateBundleProvider;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;

public final class EsqlBundleProvider implements TextMateBundleProvider {
	private static final String[] BUNDLE_FILES = {
		"package.json",
		"syntaxes/esql.tmLanguage.json",
	};

	private static volatile Path cachedBundlePath;

	@Override
	public List<PluginBundle> getBundles() {
		try {
			return List.of(new PluginBundle("esql", extractBundle()));
		} catch (IOException exception) {
			return List.of();
		}
	}

	private synchronized Path extractBundle() throws IOException {
		if (cachedBundlePath != null && Files.exists(cachedBundlePath)) {
			return cachedBundlePath;
		}

		Path bundleRoot = Path.of(PathManager.getSystemPath(), "esql-textmate-bundle");

		for (String resource : BUNDLE_FILES) {
			Path target = bundleRoot.resolve(resource);
			Files.createDirectories(target.getParent());

			try (InputStream stream = getClass().getClassLoader().getResourceAsStream("textmate/" + resource)) {
				if (stream == null) {
					throw new IOException("Missing bundled resource: textmate/" + resource);
				}
				Files.copy(stream, target, StandardCopyOption.REPLACE_EXISTING);
			}
		}

		cachedBundlePath = bundleRoot;
		return bundleRoot;
	}
}
