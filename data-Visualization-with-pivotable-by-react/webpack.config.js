const path = require('path');

module.exports = {
    mode: 'development',
	// 入口文件
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.join(__dirname, '/dist')
    },
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.js[x]?$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                      loader: 'url-loader',
                      options: {
                        limit: 500
                      }
                    }
                ]
            }, {
                test: /\.(eot|woff2?|ttf|svg)$/,
                use: "url-loader"
            }
        ]
    }
}

