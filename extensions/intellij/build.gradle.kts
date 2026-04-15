plugins {
	java
	id("org.jetbrains.intellij.platform") version "2.6.0"
}

group = "co.elastic.esql-syntax"
version = providers.gradleProperty("pluginVersion").orElse("0.1.0").get()

repositories {
	mavenCentral()
	intellijPlatform {
		defaultRepositories()
	}
}

java {
	toolchain {
		languageVersion.set(JavaLanguageVersion.of(21))
	}
}

val generatedTextmateDir = layout.buildDirectory.dir("generated/textmate")
val sourceGrammar = projectDir.resolve("../../syntaxes/esql.tmLanguage.json")

val syncTextmateBundle by tasks.registering(Sync::class) {
	doFirst {
		check(sourceGrammar.exists()) {
			"Missing grammar: ${sourceGrammar.path}."
		}
	}

	from(sourceGrammar)
	into(generatedTextmateDir.map { it.dir("syntaxes") })
	rename { "esql.tmLanguage.json" }
}

tasks.processResources {
	dependsOn(syncTextmateBundle)
	from(generatedTextmateDir) {
		into("textmate")
	}
}

dependencies {
	intellijPlatform {
		intellijIdeaCommunity("2024.3")
		bundledPlugin("org.jetbrains.plugins.textmate")
	}
}

intellijPlatform {
	publishing {
		token = providers.gradleProperty("intellijPlatformPublishingToken")
	}
	pluginConfiguration {
		ideaVersion {
			sinceBuild = "243"
		}
	}
}

tasks.buildSearchableOptions {
	enabled = false
}
