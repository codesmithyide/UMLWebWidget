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

function exportSVGToHTML(svg, path, stylesheet = false) {
    let data = ""
    if (stylesheet) {
        data = "<!DOCTYPE html><html><head><link rel=\"stylesheet\" href=\"../../../styleSheets/codesmithy-umlwebwidget.css\"></link></head><body><div class=\"CodeSmithyUMLWebWidget\">" + svg.svg() + "</div></body></html>"
    } else {
        data = "<!DOCTYPE html><html><body><div>" + svg.svg() + "</div></body></html>"
    }
    fs.writeFileSync(path, prettyprint.xml(data))
}
