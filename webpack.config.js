var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/App.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + "/dist"
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader"
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