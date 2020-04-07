const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const { optimize } = require('webpack');
const { join } = require('path');

const isProduction = process.env.NODE_ENV === 'production';
let prodPlugins = [];

if (isProduction) {
  prodPlugins.push(
    new optimize.AggressiveMergingPlugin(),
    new optimize.OccurrenceOrderPlugin()
  );
}

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: 'inline-source-map',
  entry: {
    contentscript: join(__dirname, 'src/contentscript', 'index.ts'),
    background: join(__dirname, 'src/background', 'index.ts'),
    popup: join(__dirname, 'src/popup', 'index.ts'),
    options: join(__dirname, 'src/options', 'index.ts'),
    tabStore: join(__dirname, 'src/tabStore', 'index.ts'),
    exportImport: join(__dirname, 'src/exportImport', 'index.ts')
  },
  output: {
    path: join(__dirname, 'dist'),
    chunkFilename: '[name].bundle.js',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts?$/,
        use: 'awesome-typescript-loader?{configFileName: "tsconfig.json"}'
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    ...prodPlugins,
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    ...['background', 'options', 'popup', 'tabStore', 'exportImport'].map(
      (name) =>
        new HtmlWebpackPlugin({
          template: join('src', name, `${name}.html`),
          inject: 'body',
          chunks: [name],
          filename: `${name}.html`
        })
    )
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': join(__dirname, 'src')
    }
  }
};
