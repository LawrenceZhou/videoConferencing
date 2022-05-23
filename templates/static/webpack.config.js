const webpack = require('webpack');
const resolve = require('path').resolve;

const config = {
 devtool: 'eval-source-map',
 entry: __dirname + '/js/index.jsx',
 output:{
      path: resolve('../public/'),
      filename: 'bundle.js',
      publicPath: resolve('../public/')
},
 resolve: {
  extensions: ['.js','.jsx','.css','.jpg','png']
 },
 module: {
  rules: [
  {
   test: /\.jsx?/,
   loader: 'babel-loader',
   exclude: /node_modules/,
   query:{
     presets: ['react','es2015']
   }
  },

  {
    test: /\.css$/,
    //loader: 'style-loader!css-loader?modules'
    loader: 'style-loader!css-loader'
  },
  {
     test: /\.(png|jpe?g|gif|mp3|tif|wav)$/i,
     loader: 'url-loader',
     //use: 'file-loader?name=/assets/[name].[ext]'
    options: {
      name: '/assets/[name].[ext]',
       //publicPath: '/assets/',
    },
  }]
 }
};
module.exports = config;
