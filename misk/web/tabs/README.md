How to make a new admin tab
---

- For this document, the following tab properties are used in examples
  - name: New Tab
  - slugified name: newtab
  - port: 30420
  - action name: NewTabAction
- Duplicate the `tabs/example` tab
- Open `package.json` and update the following fields replacing the variables defined by enclosed curly braces `{ }`
  - name: `misktab-newtab`. Package name must only have lowercase letters.
  - miskTabWebpack:
    - name: `New Tab`. Titlecase Tab Name.
    - output_path: optional override field. By default it will be `dist`.
    - port: `30420`.  port number for Webpack Dev Server. Reserve a port number with a PR into `@misk/tabs`.
      - `3100-3199`: Misk infrastructure (ex. Loader tab).
      - `3200-3499`: Misk default tabs (ex. Config).
      - `3500-9000`: Square reserved ports.
      - `30000-39999`: All other Misk services reserved ports.
    - relative_path_prefix: `_tab/newtab`. Slugified lowercase tab name prefixed by `_tab/`.
  - Example
  
    ```JSON
    "name": "misktab-newtab",
    ...
    "miskTabWebpack": {
      "name": "New Tab",
      "output_path": "dist",
      "port": "30420",
      "relative_path_prefix": "_tab/newtab/",
      "slug": "newtab"
    }
    ```

- Open `src/index.html` and update the line `<div id="example">` to `<div id="newtab">`.
- Open `src/index.tsx ` and update the line `document.getElementById("example")` to `document.getElementById("newtab")`.

# In Misk Service
- Add the following multibindings to the appropriate KAbstractModule.
  - If the tab has it's own module (ie. Config Tab has `ConfigWebModule.kt`), then add the following bindings to that module.
  - Else, create a new module and install the module
  - If the tab is part of base `Misk`, then add to `misk/src/main/kotlin/misk/web/AdminTabModule.kt`.
  - If it's a service specific tab, then add to your main module (ie. `UrlShortenerServiceModule`).

  ```Kotlin
  multibind<WebActionEntry>().toInstance(WebActionEntry<NewTabAction>())
  multibind<AdminTab>().toInstance(AdminTab(
      name = "New Tab",
      slug = "newtab",
      url_path_prefix = "/_admin/newtab/"
  ))
  ...
  if (environment == Environment.DEVELOPMENT) {
    ...
    multibind<WebActionEntry>().toInstance(
      WebActionEntry<WebProxyAction>("/_tab/newtab/"))
    multibind<WebProxyEntry>().toInstance(
      WebProxyEntry("/_tab/newtab/", "http://localhost:30420/"))
    ...
  } else {
    ...
    multibind<WebActionEntry>().toInstance(
      WebActionEntry<StaticResourceAction>("/_tab/newtab/"))
    multibind<StaticResourceEntry>()
      .toInstance(StaticResourceEntry("/_tab/newtab/", "classpath:/web/_tab/newtab"))
    ...
  }
  ```