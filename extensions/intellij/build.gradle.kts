/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

plugins {
	java
	id("org.jetbrains.intellij.platform") version "2.6.0"
}

group = "co.elastic.highlight-esql"
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
val sourceLicense = projectDir.resolve("../../LICENSE.txt")
val sourceNotice = projectDir.resolve("../../NOTICE.txt")

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
	from(arrayOf(sourceLicense, sourceNotice)) {
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
