const webpack = require('webpack');
const _externals = require('externals-dependencies');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isEnvProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isEnvProduction ? 'production' : 'development',
  entry: './bin/www.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
  },
  devtool: 'inline-source-map',
  // 排除devDependencies
  externals: _externals(),
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        use: {
          loader: 'awesome-typescript-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    new CopyWebpackPlugin({
        patterns: [
            { from: 'logs', to: 'logs' },
            { from: 'package.json', to: '' },
        ],
    }),
    new webpack.DefinePlugin({
       // 不知道为啥打包无法设置环境变量，直接这边设置了
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    // new webpack.SourceMapDevToolPlugin({
    //     filename: '[name].js',
    //     test: /.(tsx?|jsx?|css|less|scss)$/,
    //     exclude: '/node_modules/',
    // })
  ],
};
