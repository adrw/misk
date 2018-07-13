package com.squareup.urlshortener

import misk.client.HttpClientsConfig
import misk.config.Config
import misk.hibernate.DataSourceClusterConfig
import misk.web.WebConfig

data class UrlShortenerConfig(
  val web: WebConfig,
  val data_source_cluster: DataSourceClusterConfig,
  val endpoint: EndpointConfig,
  val http_clients: HttpClientsConfig
) : Config
