var streamFolder = require(__dirname)
var path = require('path')
var fs = require('fs')

streamFolder(path.join(__dirname, 'test', 'foo')).pipe(fs.createWriteStream(path.join(__dirname, 'test.tar.gz')))