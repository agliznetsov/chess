var webpack = require('webpack');
var path = require("path");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        bundle: './src/App.js',
        // ai: ["./src/MiniMax.js", "./src/Worker.js"]
        ai: ["./src/MiniMax.js"]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({use: 'css-loader'})
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(.*)?$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            }
        ]
    },
    resolve: {
        extensions: [".js"]
    },
    devtool: 'inline-source-map',
    plugins: [
        new CopyWebpackPlugin([
            {from: 'img', to: 'img'},
            {from: 'index.html', to: ''}
        ]),
        new ExtractTextPlugin('bundle.css'),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
};