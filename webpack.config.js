const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const { optimize } = require('webpack');
const { join } = require('path');

let prodPlugins = [];

if (process.env.NODE_ENV === 'production') {
  prodPlugins.push(
    new optimize.AggressiveMergingPlugin(),
    new optimize.OccurrenceOrderPlugin()
  );
}

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: 'inline-source-map',
  entry: {
    contentscript: join(__dirname, 'src/contentscript/contentscript.ts'),
    background: join(__dirname, 'src/background/background.ts'),
    popup: join(__dirname, 'src/popup/popup.ts'),
    options: join(__dirname, 'src/options/options.ts')
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
    new CopyPlugin([
      { from: 'src/background/background.html', to: 'background.html' },
      { from: 'src/options/options.html', to: 'options.html' },
      { from: 'src/popup/popup.html', to: 'popup.html' }
    ])
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': join(__dirname, 'src')
    }
  }
};
