package misk.web

import misk.environment.Environment
import misk.inject.KAbstractModule
import misk.web.actions.AdminTab
import misk.web.actions.WebActionEntry
import misk.web.actions.WebActionMetadataAction
import misk.web.proxy.WebProxyAction
import misk.web.proxy.WebProxyEntry
import misk.web.resources.StaticResourceAction
import misk.web.resources.StaticResourceEntry

class WebActionMetadataModule(val environment: Environment) : KAbstractModule() {
  override fun configure() {
    multibind<WebActionEntry>().toInstance(WebActionEntry<WebActionMetadataAction>())
    multibind<AdminTab>().toInstance(AdminTab(
        name = "Web Action Metadata",
        slug = "webactionmetadata",
        url_path_prefix = "/_admin/webactionmetadata/"
    ))

    if (environment == Environment.DEVELOPMENT) {
      multibind<WebActionEntry>().toInstance(
          WebActionEntry<WebProxyAction>("/_tab/webactionmetadata/"))
      multibind<WebProxyEntry>().toInstance(
          WebProxyEntry("/_tab/webactionmetadata/", "http://localhost:3201/"))
    } else {
      multibind<WebActionEntry>().toInstance(
          WebActionEntry<StaticResourceAction>("/_tab/webactionmetadata/"))
      multibind<StaticResourceEntry>()
          .toInstance(
              StaticResourceEntry("/_tab/webactionmetadata/",
                  "classpath:/web/_tab/webactionmetadata"))

    }
  }
}