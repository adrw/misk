How to make a new admin tab
---

- For this document, the following tab properties are used in examples
  - name: New Tab
  - slugified name: newtab
  - port: 30420
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


