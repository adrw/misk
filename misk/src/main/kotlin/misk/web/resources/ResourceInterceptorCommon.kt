package misk.web.resources

import misk.web.NetworkChain
import misk.web.Request
import misk.web.Response
import misk.web.actions.WebAction
import misk.web.toResponseBody
import okhttp3.HttpUrl
import kotlin.reflect.KFunction

object ResourceInterceptorCommon {
  /**
   * findMappingFromUrl
   *
   * returns mapping that matches `url_path_prefix` of incoming request
   *
   * TODO(adrw) check if there is a predictability if there are overlapping mappings ie. last mapping is fall through
   * main case: /_admin/ should not pick up all sub paths but should still return index
   * else build out (*) REGEX mapping
   */
  fun findEntryFromUrl(entries: List<Entry>, url: HttpUrl): Entry? {
    for (entry in entries) {
      if (url.encodedPath().startsWith(entry.url_path_prefix)) return entry
    }
    return null
  }

  interface Entry {
    val url_path_prefix: String
  }

  class FakeNetworkChain(
    override val request: Request
  ) : NetworkChain {
    override val action: WebAction
      get() = throw AssertionError()

    override val function: KFunction<*>
      get() = throw AssertionError()

    override fun proceed(request: Request): Response<*> {
      return Response("I am not intercepted".toResponseBody())
    }
  }

}