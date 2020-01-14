var path = require("path")

module.exports = {
    entry: "./src/index.js",
    output: {
        library: "CodeSmithyUMLWebWidget",
        libraryTarget: "umd",
        path: path.resolve(__dirname, "dist")
    },
}
