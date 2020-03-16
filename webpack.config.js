const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    //这里是省略写法，等价于
    //enrty:{
    //  main:'./src/index.js'
    //}
    output: {
        filename: '[name].bundle.js',//根据入口名，生成不同的文件，这里示例的入口名是main被省略了，所以生成的是main.js而不是index.js
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'source-map',
    // resolve: {
    //     modules: [path.resolve(__dirname, 'source'), path.resolve('node_modules')]
    // },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './index.html')
        }),
        // new CleanWebpackPlugin(['dist']),
        // new webpack.NamedModulesPlugin(),
        // new webpack.HotModuleReplacementPlugin()
    ],
}