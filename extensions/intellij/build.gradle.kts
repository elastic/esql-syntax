plugins {
	java
	id("org.jetbrains.intellij.platform") version "2.6.0"
}

group = "co.elastic.esql-syntax"
version = providers.gradleProperty("pluginVersion").orElse("0.0.0").get()

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
val generatedMetaInfDir = layout.buildDirectory.dir("generated/META-INF")
val sourceGrammar = projectDir.resolve("../../syntaxes/esql.tmLanguage.json")
val sourceIcon = projectDir.resolve("../icon.svg")

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

val syncPluginIcon by tasks.registering(Copy::class) {
	from(sourceIcon)
	into(generatedMetaInfDir)
	rename { "pluginIcon.svg" }
}

tasks.processResources {
	dependsOn(syncTextmateBundle, syncPluginIcon)
	from(generatedTextmateDir) {
		into("textmate")
	}
	from(generatedMetaInfDir) {
		into("META-INF")
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
