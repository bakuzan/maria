const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { optimize } = require('webpack');
const { join } = require('path');

const isProduction = process.env.NODE_ENV === 'production';
let prodPlugins = [];

if (isProduction) {
  prodPlugins.push(new optimize.AggressiveMergingPlugin());
  prodPlugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
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
    exportImport: join(__dirname, 'src/exportImport', 'index.ts'),
    rssViewer: join(__dirname, 'src/rssViewer', 'index.ts'),
    timezoneConverter: join(__dirname, 'src/timezoneConverter', 'index.ts')
  },
  output: {
    path: join(__dirname, 'dist'),
    chunkFilename: '[name].bundle.js',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          // disable type checker - we will use it in fork plugin
          transpileOnly: true
        }
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    ...prodPlugins,
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    ...[
      'background',
      'options',
      'popup',
      'tabStore',
      'exportImport',
      'rssViewer',
      'timezoneConverter'
    ].map(
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
    },
    fallback: {
      timers: require.resolve('timers-browserify'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      url: require.resolve('url/'),
      buffer: require.resolve('buffer/')
    }
  }
};
