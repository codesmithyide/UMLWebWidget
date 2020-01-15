var path = require("path")

module.exports = {
    entry: "./src/index.js",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
    output: {
        library: "CodeSmithyUMLWebWidget",
        libraryTarget: "umd",
        path: path.resolve(__dirname, "dist")
    },
}
