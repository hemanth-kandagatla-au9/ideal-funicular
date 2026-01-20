import { merge } from "webpack-merge";
import * as webpack from "webpack";
import { container } from "webpack";
import commonConfig from "./webpack.config";
import { dependencies as deps } from "./package.json";

const { ModuleFederationPlugin } = container;

type CommonConfig = webpack.Configuration;

const typedCommonConfig: CommonConfig = commonConfig as CommonConfig;

interface PredevConfig extends webpack.Configuration {
  plugins: webpack.WebpackPluginInstance[];
}

const predevConfig: PredevConfig = merge(typedCommonConfig, {
  mode: "development",
  output: {
    publicPath: "http://localhost:3005/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "iabot",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./iabotModule": "./src/App.tsx", // Relative path without resolution
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
        APP_ENV: "local",
        GENERATE_SOURCEMAP: false,
        SKIP_PREFLIGHT_CHECK: true,
        FAST_REFRESH: false,
        REACT_APP_AUTH_URL: "https://predev.auth.rise.apps.jnj.com",
        REACT_APP_AGENT_URL: "https://predev.smartops.rise.apps.jnj.com",
        RUST_AGENT_URL: "http://localhost:3001",
        //RUST_AGENT_URL: "https://iabot.aiops-dev.aifalabs.com/api",
      }),
    }),
  ],
}) as PredevConfig;

export default predevConfig;
