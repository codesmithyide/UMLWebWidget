'use strict'

var fs = require('fs')

module.exports = {
    createDirectory: createDirectory
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
