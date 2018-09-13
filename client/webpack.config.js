const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
var webpack = require("webpack");
const dotenv = require('dotenv');


module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "index-bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
            	name: '[path][name].[ext]',
    			outputPath: 'images/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new webpack.DefinePlugin({
    	'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_URL: JSON.stringify(process.env.API_URL),
        ACCESS_TOKEN: JSON.stringify(process.env.ACCESS_TOKEN)
      }
  	})
  ]
};