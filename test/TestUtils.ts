/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

var fs = require('fs')
var prettyprint = require('pretty-data').pd;

class TestUtils {
    static createDirectory(path: string): void {
        try {
            fs.mkdirSync(path)
        } catch (e) {
            if (e.code !== 'EEXIST') {
                throw e
            }
        }
    }

    static exportSVGToHTML(svg, path: string, stylesheet: boolean = false): void {
        let data = ""
        if (stylesheet) {
            data = "<!DOCTYPE html><html><head><link rel=\"stylesheet\" href=\"../../../styleSheets/codesmithy-umlwebwidget.css\"></link></head><body><div class=\"CodeSmithyUMLWebWidget\">" + svg.svg() + "</div></body></html>"
        } else {
            data = "<!DOCTYPE html><html><body><div>" + svg.svg() + "</div></body></html>"
        }
        fs.writeFileSync(path, prettyprint.xml(data))
    }
}

export { TestUtils }
