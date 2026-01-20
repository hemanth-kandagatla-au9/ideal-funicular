// webpack.config.ts
import * as dotenv from "dotenv";
import * as path from "path";
import * as webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { Configuration } from "webpack";
import { dependencies as deps } from "./package.json";

dotenv.config();

process.env.NODE_ENV = "production";
process.env.BABEL_ENV = "production";

const config = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    uniqueName: "dc",
    clean: true,
  },
  devServer: {
    open: false,
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 3005,
    compress: true,
    historyApiFallback: true,
    allowedHosts: "all",
  },
  resolve: {
    symlinks: false,
    fallback: {
      stream: require.resolve("stream-browserify"),
      zlib: require.resolve("browserify-zlib"),
      http: require.resolve("stream-http"),
      crypto: require.resolve("crypto-browserify"),
      os: require.resolve("os-browserify/browser"),
      https: require.resolve("https-browserify"),
      buffer: require.resolve("buffer/"),
      assert: require.resolve("assert/"),
      url: require.resolve("url/"),
      symlinks: false,
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src"), // Optional but helpful
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|ico|ttf|woff2|eot|woff)$/,
        use: ["file-loader?name=[name].[ext]"],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/, // Added ts and tsx support
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { modules: false }], ["@babel/preset-react", { runtime: "automatic" }], "@babel/preset-typescript"],
            plugins: ["@babel/plugin-transform-arrow-functions", "@babel/plugin-proposal-class-properties", "@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack", "url-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.mjs/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "async",
    },
    minimize: true,
    usedExports: true,
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
      publicPath: "/",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
      assert: "assert",
    }),
  ],
};

export default config;
