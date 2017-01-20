var path = require('path');

//将js中require的CSS文件拿出来
var ExtractTextPlugin = require("extract-text-webpack-plugin");


// var CopyWebpackPlugin = require('copy-webpack-plugin');

// var extractLESS = new ExtractTextPlugin('[name].less');

module.exports = {
    // entry: ['babel-polyfill','./bt.js'],
    entry: {
        H5FullscreenPage: ['./src/H5FullscreenPage.js'],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        // publicPath: "./local_web/",
        filename: '[name].js'
    },
    module: {
        loaders: [

            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            }

        ]
    },
    plugins: [
        new ExtractTextPlugin("H5FullscreenPage.css"),
        new ExtractTextPlugin("page-animation.css"),
    ]
};
