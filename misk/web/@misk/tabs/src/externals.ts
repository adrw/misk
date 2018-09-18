const { makeExternals } = require("@misk/dev")

/**
 * Please submit PR to reserve your tab name and port
 */
export const MiskTabMetadata = {
  "@misktabs/config": {
    "external": ["MiskTabs", "Config"],
    "port": 3200
  },
  "@misktabs/webactionmetadata": {
    "external": ["MiskTabs", "WebActionMetadata"],
    "port": 3201
  }
}

export const externals = makeExternals(
  Object.entries(MiskTabMetadata).map(
    ([tabname, metadata]) => { ({[tabname]: metadata.external}) }
  )
)