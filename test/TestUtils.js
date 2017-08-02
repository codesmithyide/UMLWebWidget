'use strict'

var fs = require('fs')
var prettyprint = require('pretty-data').pd;

module.exports = {
    createDirectory: createDirectory,
    exportSVGToHTML: exportSVGToHTML
}

function createDirectory(path) {
    try {
        fs.mkdirSync(path)
    } catch (e) {
        if (e.code !== 'EEXIST') {
            throw e
        }
    }
}

function exportSVGToHTML(svg, path) {
    let data = "<html><body><div>" + svg.svg() + "</div></body></html>"
    fs.writeFileSync(path, prettyprint.xml(data))
}
