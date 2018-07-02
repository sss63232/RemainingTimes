var webpack = require('webpack'),
  path = require('path'),
  fileSystem = require('fs'),
  env = require('./utils/env'),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  FontelloPlugin = require('fontello-webpack-plugin'),
  WriteFilePlugin = require('write-file-webpack-plugin');

// load the secrets
var alias = {};

var secretsPath = path.join(
  __dirname,
  'secrets.' + env.NODE_ENV + '.js'
);

var fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
];

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}

var options = {
  entry: {
    popup: path.join(__dirname, 'src', 'js', 'popup.js'),
    newTab: path.join(__dirname, 'src', 'js', 'newTab.js'),
    background: path.join(
      __dirname,
      'src',
      'js',
      'background.js'
    ),
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              // minimize: true || { /* CSSNano Options */ },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: new RegExp(
          '.(' + fileExtensions.join('|') + ')$'
        ),
        loader: 'file-loader?name=[name].[ext]',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: alias,
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin(['build']),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
    }),
    new FontelloPlugin({
      config: require('./src/img/fontello/config.json'),
      /* ...options */
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/manifest.json',
        transform: function(content, path) {
          // generates the manifest file using the package.json informations
          return Buffer.from(
            JSON.stringify({
              description:
                process.env.npm_package_description,
              version: process.env.npm_package_version,
              ...JSON.parse(content.toString()),
            })
          );
        },
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'newTab.html'),
      filename: 'newTab.html',
      chunks: ['newTab'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(
        __dirname,
        'src',
        'background.html'
      ),
      filename: 'background.html',
      chunks: ['background'],
    }),
    new WriteFilePlugin(),
  ],
};

if (env.NODE_ENV === 'development') {
  // options.devtool = 'cheap-module-eval-source-map';
  options.devtool = 'source-map';
}

process.traceDeprecation = true;
process.noDeprecation = true;
module.exports = options;
