package misk.config

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.fasterxml.jackson.module.kotlin.MissingKotlinParameterException
import misk.environment.Environment
import okio.BufferedSource
import okio.Okio
import okio.Source
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.URL

object MiskConfig {
  @JvmStatic
  inline fun <reified T : Config> load(appName: String, environment: Environment): T {
    return load(T::class.java, appName, environment)
  }

  @JvmStatic
  fun <T : Config> load(
    configClass: Class<out Config>,
    appName: String,
    environment: Environment
  ): T {
    val mapper = ObjectMapper(YAMLFactory()).registerModules(KotlinModule(), JavaTimeModule())

    val configYamls: Map<String, String?> = loadConfigYamls(appName, environment)

    @Suppress("UNCHECKED_CAST")
    try {
      return mapper.readValue(configYamls["jsonNode"], configClass) as T
    } catch (e: MissingKotlinParameterException) {
      throw IllegalStateException(
          "could not find $appName $environment configuration for ${e.parameter.name}", e)
    } catch (e: Exception) {
      throw IllegalStateException("failed to load configuration for $appName $environment", e)
    }
  }

  @Suppress("UNUSED_PARAMETER")
  fun loadConfigYamls(appName: String, environment: Environment): Map<String, String?> {
    val configYamls: MutableList<Pair<String, String?>> = mutableListOf()
    val mapper = ObjectMapper(YAMLFactory()).registerModules(KotlinModule(), JavaTimeModule())
    val configClass: Class<Config> = Config::class.java
    var jsonNode: JsonNode? = null
    val missingConfigFiles = mutableListOf<String>()
    for (configFileName in configFileNames(appName, environment)) {
      val url = getResource(configClass, configFileName)
      if (url == null) {
        missingConfigFiles.add(configFileName)
        configYamls.add(Pair(configFileName, null))
        continue
      }

//      try {
//        val fileSource: Source = Okio.source(url.openStream())
//        val bufferedSource: BufferedSource = Okio.buffer(fileSource)
//        val configString: String = bufferedSource.readUtf8()
//        configYamls.add(Pair(configFileName, configString))
//      } catch (e: Exception) {
//        throw IllegalStateException("file not found $configFileName: ${e.message}", e)
//      }

      try {
        open(url).use {
          val objectReader = if (jsonNode == null) {
            mapper.readerFor(JsonNode::class.java)
          } else {
            mapper.readerForUpdating(jsonNode)
          }
          jsonNode = objectReader.readValue(it)
        }
      } catch (e: Exception) {
        throw IllegalStateException("could not parse $configFileName: ${e.message}", e)
      }
    }

//    if (jsonNode == null) {
//      val configFileMessage = missingConfigFiles.joinToString(", ")
//      throw IllegalStateException(
//          "could not find configuration files - checked [$configFileMessage]"
//      )
//    }
    configYamls.add(Pair("jsonNode", jsonNode.toString()))
    return configYamls.associateBy(keySelector = { pair -> pair.first }, valueTransform = { pair -> pair.second })
  }

  /** @return the list of config file names in the order they should be read */
  private fun configFileNames(appName: String, environment: Environment): List<String> =
      listOf("common", environment.name.toLowerCase()).map { "$appName-$it.yaml" }

  private fun open(url: URL): BufferedReader {
    return BufferedReader(InputStreamReader(url.openStream()))
  }

  private fun getResource(
    configClass: Class<out Config>,
    fileName: String
  ) = configClass.classLoader.getResource(fileName)
}
