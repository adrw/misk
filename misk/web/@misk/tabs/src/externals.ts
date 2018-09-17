import { makeExternals } from "@misk/dev" 

/**
 * Please submit PR to reserve your tab name and port
 */
export const MiskTabMetadata = {
  "@misktabs/config": {
    "external": ["MiskTabs", "Config"],
    "port": 3200
  },
  "@misktabs/"
}


export const externals = makeExternals({
  "@misktabs/config": ["MiskTabs", "Config"],
})