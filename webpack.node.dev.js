const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    target: 'node',
    mode: 'development',
    output: {
        filename: "codesmithy-umlwebwidget.node.dev.js",
    }
});
