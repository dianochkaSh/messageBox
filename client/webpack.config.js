const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = 'localhost';
const PORT = 8082;
const API_URL  = 'http://localhost:8082/';

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        path: path.join(__dirname, '../public'),
        publicPath: '/',
        filename: 'build.js'
    },
    devServer: {
      proxy: {
          '/api' : API_URL
      }
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                use: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader', 'css-loader'
                 ]
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src"),
                    require.resolve("bootstrap-vue"),
                ],
                loader: "babel-loader"
            },
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*','.js', '.vue', '.json'],
    }

};