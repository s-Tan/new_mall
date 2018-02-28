try {
  require('os').networkInterfaces()
} catch (e) {
  require('os').networkInterfaces = () => ({})
}
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //html导出
const CleanWebpackPlugin = require('clean-webpack-plugin'); //构建时清理
const autoprefixer = require('autoprefixer'); //补全css各种hack
const ExtractTextPlugin = require("extract-text-webpack-plugin"); //分离样式表
const extractCSS = new ExtractTextPlugin(process.env.NODE_ENV === 'production' ? 'css/[name]-css.min.css' : 'css/[name]-css.css'); //导出css
const extractSass = new ExtractTextPlugin(process.env.NODE_ENV === 'production' ? 'css/[name]-sass.min.css' : 'css/[name]-sass.css'); //导出sass
const babili = require('babili-webpack-plugin'); //babel压缩

module.exports = {
  //devtool:process.env.NODE_ENV === 'production' ? 'inline-source-map' : 'source map',
  entry: {
    'authorize': ['babel-polyfill', './src/js/authorize.js'],
    'tools': ['babel-polyfill', './src/js/tools.js'],
    'index': ['babel-polyfill', './src/js/index.js'],
    'djdzm': ['babel-polyfill', './src/js/djdzm.js'],
    'zty': ['babel-polyfill', './src/js/zty.js']
  },
  output: {
    filename: 'js/[name].min.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /(node_modules|bower_components)/,
        options: {
          loaders: {
            css: ExtractTextPlugin.extract({
              use: ['css-loader?minimize=true', 'postcss-loader'],
              fallback: 'vue-style-loader',
              publicPath: "../"
            }),
            scss: ExtractTextPlugin.extract({
              use: ['css-loader?minimize=true!', 'sass-loader', 'postcss-loader'],
              fallback: 'vue-style-loader',
              publicPath: "../"
            }),
            sass: ExtractTextPlugin.extract({
              use: ['css-loader?minimize=true!', 'sass-loader?indentedSyntax', 'postcss-loader'],
              fallback: 'vue-style-loader',
              publicPath: "../"
            }),
          }
        },
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: ['css-loader?importLoaders=1', 'postcss-loader'],
          publicPath: "../"
        }),
      },
      {
        test: /\.scss/i,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader', 'postcss-loader'],
          publicPath: "../"
        })
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=imgs/[name].[ext]'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader?name=font/[name].[ext]'
        ]
      },
      {
        test: /\.html$/,
        use: [
          'html-loader',
          'markup-inline-loader?strict=[markup-inline]',
        ]
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    //清理dist
    new CleanWebpackPlugin(['dist']),
    //样式导出配置
    extractCSS,
    extractSass,
    //提取组件样式
    //new ExtractTextPlugin("css/components.min.css"),
    //html模板输出
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: 'body',
      hash: true,
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, "./dist/djdzm.html"),
      template: './src/djdzm.html',
      inject: 'body',
      hash: true,
      chunks: ['djdzm'],
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, "./dist/zty.html"),
      template: './src/zty.html',
      inject: 'body',
      hash: true,
      chunks: ['zty'],
    }),
    //丑化JS
    (process.env.NODE_ENV === 'production') ? new babili() : function () {},
  ],
};