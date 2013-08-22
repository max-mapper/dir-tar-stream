var dirtar = require(__dirname)
var path = require('path')
var fs = require('fs')

var src = path.join(__dirname, 'test', 'foo')
var dest = path.join(__dirname, 'test.tar.gz')

dirtar(src).pipe(fs.createWriteStream(dest))

