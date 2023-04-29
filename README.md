# Routine Tactics

An cross platform task managing app for developers

---

### Getting started

---

-  Install all packages
   Install all the packages using yarn in the root directory

   ```bash
   yarn
   ```

-  Update metro-config.js
   In the root directory navigate to node_modules/expo/metro-config.js and paste the code given below

   ```js
   const { getDefaultConfig } = require("expo/metro-config");
   const path = require("path");

   // Find the project and workspace directories
   const projectRoot = __dirname;
   const workspaceRoot = path.resolve(projectRoot, "../..");

   const config = getDefaultConfig(projectRoot);

   // 1. Watch all files within the monorepo
   config.watchFolders = [workspaceRoot];
   // 2. Let Metro know where to resolve packages and in what order
   config.resolver.nodeModulesPaths = [
   	path.resolve(projectRoot, "node_modules"),
   	path.resolve(workspaceRoot, "node_modules"),
   ];
   // 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
   config.resolver.disableHierarchicalLookup = true;

   module.exports = config;
   ```
