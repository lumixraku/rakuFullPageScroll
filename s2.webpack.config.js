var path = require('path');
var webpack = require('webpack');
//将js中require的CSS文件拿出来
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        bdcH5FullscreenPage: ['./bdsimple2/simpleH5FullscreenPage.js']
    },
    output: {
        path: path.join(__dirname, 'dist'),
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
        new ExtractTextPlugin("simpleH5FullscreenPage.css"),
        // new ExtractTextPlugin("simple_page-animation.css"),
        // new webpack.optimize.UglifyJsPlugin({
        //   compress: {
        //     warnings: false
        //   }
        // })
    ]
};
