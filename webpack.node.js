const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    target: 'node',
    mode: 'production',
    output: {
        filename: "codesmithy-umlwebwidget.node.js",
    }
});
