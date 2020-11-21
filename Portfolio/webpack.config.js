const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: {
    historyApiFallback: true,
    watchContentBase: true
  },
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/env"]
        }
      },
      {
        test: /\.(s*)css$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: '[name].[ext]',
            publicPath: 'dist',
          }
        }]
      },
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    port: 3000,
    publicPath: "http://localhost:3000/dist/",
    watchContentBase: true,
    writeToDisk: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new CopyPlugin({
    patterns: [{
      from: "src/img",
      to: "img"
    }],
  }), new HtmlWebpackPlugin({
    filename: 'public/index.html',
    template: 'public/index.html',
    inject: true
  })]
};