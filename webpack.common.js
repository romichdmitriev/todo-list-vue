const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const EslintPluginInit = isDev ? [new ESLintPlugin()] : [];

const CSSExtractor = new MiniCssExtractPlugin({
  filename: 'styles/[name].css',
  chunkFilename: 'styles/[id].css',
});

module.exports = {
  target: 'web',
  context: path.resolve(__dirname, 'src'),
  entry: ['./index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:8].js',
    chunkFilename: '[id].[hash:8].js',
    assetModuleFilename: 'assets/[name][ext]',
    clean: true,
  },
  resolve: {
    extensions: ['*', '.js', '.vue'],
    alias: {
      '@pages': path.resolve(__dirname, 'src/pages/'),
      '@icons': path.resolve(__dirname, 'src/assets/icons/'),
      '@images': path.resolve(__dirname, 'src/assets/img/'),
      '@utils': path.resolve(__dirname, 'src/js/utils/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
    },
  },
  optimization: {
    // chunkIds: 'named',
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          // `.swcrc` can be used to configure swc
          loader: 'swc-loader',
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: process.env.NODE_ENV !== 'production' ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => `${path.relative(path.dirname(resourcePath), context)}/`,
              esModule: false,
            },
          },
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [
                { search: '@images', replace: '../assets/img' },
                { search: '@icons', replace: '../assets/icons' },
              ],
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          filename: '[path][name]-[hash][ext]',
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[path][name].[hash:8][ext]',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new VueLoaderPlugin(),
    CSSExtractor,
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    ...EslintPluginInit,
    new StyleLintPlugin({
      files: ['src/**/*.{html,vue,css,sass,scss}'],
      fix: true,
      cache: true,
      emitErrors: true,
      failOnError: false,
    }),
  ],
};
