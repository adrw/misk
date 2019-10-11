package misk.web.actions

import misk.config.AppName
import misk.environment.Environment
import misk.security.authz.Unauthenticated
import misk.web.Get
import misk.web.RequestContentType
import misk.web.ResponseContentType
import misk.web.mediatype.MediaTypes
import javax.inject.Inject
import javax.inject.Singleton

/**
 * metadata to build navbar of admin dashboard
 */

@Singleton
class ServiceMetadataAction @Inject constructor(
  private val optionalBinder: OptionalBinder
) : WebAction {
  @Get("/api/service/metadata")
  @RequestContentType(MediaTypes.APPLICATION_JSON)
  @ResponseContentType(MediaTypes.APPLICATION_JSON)
  @Unauthenticated
  fun getAll(): Response {
    return Response(serviceMetadata = optionalBinder.serviceMetadata)
  }

  data class Response(val serviceMetadata: ServiceMetadata)
}

/**
 * https://github.com/google/guice/wiki/FrequentlyAskedQuestions#how-can-i-inject-optional-parameters-into-a-constructor
 */
@Singleton
class OptionalBinder @Inject constructor(@AppName val appName: String, serviceMetadataNavbarItems: List<ServiceMetadataNavbarItem>) {
  @com.google.inject.Inject(optional = true)
  var serviceMetadata: ServiceMetadata =
    ServiceMetadata(appName, Environment.fromEnvironmentVariable(), "/_admin/",
      serviceMetadataNavbarItems.sortedBy { it.order }.map { it.item })
}

data class ServiceMetadata(
  val app_name: String,
  val environment: Environment,
  val admin_dashboard_url: String,
  val navbar_items: List<String>
)

data class ServiceMetadataNavbarItem(
  val item: String,
  val order: Int
)