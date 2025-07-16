// webpack.config.mjs
import webpack from "webpack";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// __dirname 相当（ESM では自前で作る）
const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  /* ------------- 基本設定 ------------- */
  mode: "development", // production にすると自動で最適化
  entry: "./demo/index.ts", // TypeScript のエントリポイント

  /* ------------- プラグイン ------------- */
  plugins: [
    // 古い依存が Promise を期待する場合のポリフィル
    new webpack.ProvidePlugin({ Promise: "es6-promise" }),
  ],

  /* ------------- 出力 ------------- */
  output: {
    filename: "index.bundle.js", // 生成される JS
    path: path.resolve(__dirname, "demo"), // demo/ に書き出し
  },

  /* ------------- ローダー ------------- */
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader", // TypeScript → JS
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // CSS をバンドル
      },
      {
        test: /\.(png|jpe?g|gif)$/i, // 画像をコピー（必要なら）
        type: "asset/resource",
      },
    ],
  },

  /* ------------- 解決拡張子 ------------- */
  resolve: {
    extensions: [".ts", ".js"],
  },

  /* ------------- ソースマップ ------------- */
  devtool: "inline-source-map",

  /* ------------- 開発サーバ ------------- */
  devServer: {
    static: {
      directory: path.resolve(__dirname, "demo"), // demo を公開
      watch: true,
    },
    port: 8080, // 変更可
    open: true, // 自動でブラウザを開く
    hot: true,
  },
};
