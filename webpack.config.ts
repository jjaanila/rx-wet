const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const distDir = path.join(__dirname, 'dist');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: path.resolve(__dirname, './src/index.ts'),
  devtool: 'inline-source-map',
  devServer: {
    contentBase: distDir,
    compress: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            options: {
              configFileName: path.resolve(__dirname, 'tsconfig.json'),
            },
            loader: 'awesome-typescript-loader',
          },
        ],
        rules: [
          {
            test: /\.js$/,
            enforce: 'pre',
            use: ['source-map-loader'],
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: path.resolve(distDir, 'index.html'),
    }),
  ],
  output: {
    filename: 'bundle.[hash].js',
    path: distDir,
  },
};
