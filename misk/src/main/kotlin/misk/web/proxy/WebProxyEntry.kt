package misk.web.proxy

import misk.web.resources.ResourceEntryCommon
import okhttp3.HttpUrl

//  TODO(adrw) fix this documentation if forwarding rewrites are restricted or other conditions in place
/**
 * WebProxyEntry
 *
 * Maps URLs requested against this server to URLs of servers to delegate to
 *
 * url_path_prefix: `/_admin/`
 * web_proxy_url: `http://localhost:3000/`
 *
 * An incoming request then for `/_admin/config.js` would route to `http://localhost:3000/_admin/config.js`.
 *
 *
 * This data class is used with Guice multibindings. Register instances by calling `multibind()`
 * in a `KAbstractModule`:
 *
 * ```
 * multibind<WebProxyEntry>().toInstance(WebProxyEntry(...))
 * ```
 */
data class WebProxyEntry(
  override val url_path_prefix: String,
  val web_proxy_url: HttpUrl
) : ResourceEntryCommon.Entry {
  init {
    ResourceEntryCommon.requireValidUrlPathPrefix(url_path_prefix)
    require(web_proxy_url.encodedPath().endsWith("/") &&
        web_proxy_url.pathSegments().size == 1)
  }
}

fun WebProxyEntry(
  url_path_prefix: String,
  web_proxy_url: String
) : WebProxyEntry {
//  TODO(adrw) update all HTTPUrl.parse -> get (no bang bang required) https://github.com/square/misk/issues/419
  return WebProxyEntry(url_path_prefix, HttpUrl.parse(web_proxy_url)!!)
}