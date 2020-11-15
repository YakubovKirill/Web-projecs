const path = require('path');

module.exports = {
    entry: './src/js/index.js',
    module: {
        rules: [
            { test: /\.(js)$/, use: 'babel-loader' }
        ]
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, "./dist")
    }
}