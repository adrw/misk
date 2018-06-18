package misk.config

import misk.environment.Environment
import misk.web.Get
import misk.web.RequestContentType
import misk.web.ResponseContentType
import misk.web.actions.WebAction
import misk.web.mediatype.MediaTypes
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ConfigAdminAction : WebAction {
  @Inject @AppName lateinit var appName: String
  @Inject lateinit var environment: Environment

  @Get("/_admin/config")
  @RequestContentType(MediaTypes.APPLICATION_JSON)
  @ResponseContentType(MediaTypes.APPLICATION_JSON)
  fun getAll(): Response {
    return Response(effective_config = "bar: baz", yaml_files = MiskConfig.loadConfigYamls(appName, environment))
  }

  data class Response(val effective_config: String, val yaml_files: Map<String, String?>)
}