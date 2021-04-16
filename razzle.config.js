const LodashPlugin = require("lodash-webpack-plugin");
const path = require("path");
const SpeedMeasureWebpackPlugin = require("speed-measure-webpack-plugin");

const measure = process.argv.some((arg) => arg === "--measure");

const smp = new SpeedMeasureWebpackPlugin({ disable: !measure });

module.exports = {
  options: { verbose: false, enableReactRefresh: false, buildType: "serveronly" },
  plugins: [
    {
      name: "typescript",
      options: {
        useBabel: true,
      },
    },
  ],
  modifyPaths({ paths }) {
    paths.appServerIndexJs = path.resolve("src", "index.ts");

    return paths;
  },
  modifyWebpackOptions({ options: { webpackOptions }, env: { target } }) {
    if (target === "node") {
      webpackOptions.terserPluginOptions = {
        terserOptions: {
          mangle: false,
          compress: {
            keep_classnames: true,
            keep_fnames: true,
          },
        },
        sourceMap: true,
        parallel: true,
      };
    }

    return webpackOptions;
  },
  modifyWebpackConfig({ webpackConfig }) {
    let config = webpackConfig;

    config.resolve.alias["@"] = path.resolve("src");
    config.resolve.alias["lodash-es"] = "lodash";

    config.plugins.unshift(new LodashPlugin({ paths: true }));

    return smp.wrap(config);
  },
  modifyJestConfig({ jestConfig }) {
    delete jestConfig.transform["^.+\\.(js|jsx|mjs|cjs|ts|tsx)$"];

    jestConfig = {
      ...jestConfig,
      preset: "ts-jest/presets/js-with-babel",
      moduleNameMapper: {
        ...jestConfig.moduleNameMapper,
        "^@/(.*)$": "<rootDir>/src/$1",
      },
      coverageDirectory: "<rootDir>/coverage",
      globals: {
        "ts-jest": {
          babelConfig: ".babelrc",
        },
      },
    };

    return jestConfig;
  },
};
