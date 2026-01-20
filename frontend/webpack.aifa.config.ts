import { merge } from "webpack-merge";
import * as webpack from "webpack";
import { container } from "webpack";
import path from "path";
import commonConfig from "./webpack.config";
import { dependencies as deps } from "./package.json";

const { ModuleFederationPlugin } = container;

type CommonConfig = webpack.Configuration;

const typedCommonConfig: CommonConfig = commonConfig as CommonConfig;

interface ProdConfig extends webpack.Configuration {
  plugins: webpack.WebpackPluginInstance[];
}

const prodConfig: ProdConfig = merge(typedCommonConfig, {
  mode: "production",
  output: {
    publicPath: "https://iabot.aiops-dev.aifalabs.com/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "iabot",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./iabotModule": "./src/App.tsx",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify({
        APP_ENV: "predev",
        GENERATE_SOURCEMAP: false,
        SKIP_PREFLIGHT_CHECK: true,
        FAST_REFRESH: false,
        RUST_AGENT_URL: "https://iabot.aiops-dev.aifalabs.com/api",
      }),
    }),
  ],
}) as ProdConfig;

export default prodConfig;
