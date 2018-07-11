package misk.web

import com.google.inject.Provides
import misk.MiskModule
import misk.inject.KAbstractModule
import misk.resources.FakeResourceLoaderModule
import misk.web.actions.UpstreamResourceInterceptor
import javax.inject.Singleton

class WebTestingModule(private val ssl: WebSslConfig? = null) : KAbstractModule() {
  override fun configure() {
    install(MiskModule())
    install(WebModule())
    install(FakeResourceLoaderModule())
    multibind<NetworkInterceptor.Factory>()
        .to<UpstreamResourceInterceptor.Factory>()
  }

  @Provides
  @Singleton
  fun provideWebConfig() = WebConfig(0, 500000, host = "127.0.0.1", ssl = ssl)
}
