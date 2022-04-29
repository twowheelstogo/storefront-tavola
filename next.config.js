const path = require("path");
const lodash = require("lodash");
const appConfig = Object.entries(require("./config"))
  .filter(([k]) => !k.match("npm_"))
  .reduce((p, [k, v]) => ({ ...p, [k]: v }), {});
module.exports = {
  publicRuntimeConfig: appConfig,
  env: lodash.omit(appConfig, ["NODE_VERSION", "NODE_ENV"]),
  webpack: (webpackConfig) => {
    webpackConfig.module.rules.push({
      test: /\.(gql|graphql)$/,
      loader: "graphql-tag/loader",
      exclude: ["/node_modules/", "/.next/"],
      enforce: "pre"
    });

    webpackConfig.module.rules.push({
      test: /\.mjs$/,
      type: "javascript/auto"
    });

    // Duplicate versions of the styled-components package were being loaded, this config removes the duplication.
    // It creates an alias to import the es modules version of the styled-components package.
    // This is a workaround until the root issue is resolved: https://github.com/webpack/webpack/issues/9329
    webpackConfig.resolve.alias["styled-components"] = "styled-components/dist/styled-components.browser.esm.js";

    webpackConfig.resolve.alias.components = path.join(__dirname, "components");
    webpackConfig.resolve.alias.containers = path.join(__dirname, "containers");
    webpackConfig.resolve.alias.context = path.join(__dirname, "context");
    webpackConfig.resolve.alias.custom = path.join(__dirname, "custom");
    webpackConfig.resolve.alias.hocs = path.join(__dirname, "hocs");
    webpackConfig.resolve.alias.hooks = path.join(__dirname, "hooks");
    webpackConfig.resolve.alias.lib = path.join(__dirname, "lib");
    webpackConfig.resolve.alias.pages = path.join(__dirname, "pages");
    webpackConfig.resolve.alias.public = path.join(__dirname, "public");
    webpackConfig.resolve.alias.static = path.join(__dirname, "static");
    webpackConfig.resolve.alias.serverUtils = path.join(__dirname, "serverUtils");
    webpackConfig.resolve.alias.translations = path.join(__dirname, "translations");
    webpackConfig.resolve.alias.routes = path.join(__dirname, "routes");
    webpackConfig.resolve.alias.utils = path.join(__dirname, "utils");
    webpackConfig.resolve.alias.staticUtils = path.join(__dirname, "staticUtils");
    webpackConfig.resolve.alias.apiUtils = path.join(__dirname, "apiUtils");

    return webpackConfig;
  },
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 800,
      aggregateTimeout: 300,
    }
    return config
  },
  experimental: {
    redirects() {
      return [
        {
          source: "/graphiql",
          destination: appConfig.EXTERNAL_GRAPHQL_URL,
          permanent: true
        },
        {
          source: "/graphql-beta",
          destination: appConfig.EXTERNAL_GRAPHQL_URL,
          permanent: true
        },
        {
          source: "/graphql-alpha",
          destination: appConfig.EXTERNAL_GRAPHQL_URL,
          permanent: true
        },
        {
          source: "/graphql",
          destination: appConfig.EXTERNAL_GRAPHQL_URL,
          permanent: true
        }
      ];
    },
    rewrites() {
      return [
        // Sitemap
        {
          source: "/sitemap:subPage?.xml",
          destination: "/api/sitemap"
        },
        {
          source: "/",
          destination: "/api/detectLanguage"
        }
      ];
    }
  }

};
