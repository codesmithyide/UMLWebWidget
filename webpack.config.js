var path = require("path")

module.exports = {
    entry: "./src/index.js",
    output: {
        library: "CodeSmithyUMLWebWidget",
        libraryTarget: "umd",
        filename: "codesmithy-umlwebwidget.js",
        path: path.resolve(__dirname, "dist")
    }
}
