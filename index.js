var fs = require('fs')
var zlib = require('zlib')
var ls = require('ls-stream')
var archiver = require('archiver')
var path = require('path')

module.exports = streamFolder

function streamFolder(dir) {
  var gzipper = zlib.createGzip()
  var archive = archiver('tar')

  archive.on('error', function(err) {
    throw err
  })

  archive.pipe(gzipper)

  ls(dir)
    .on('data', function(file) {
      if (!file.stat.isFile()) return
      var relPath = path.relative(__dirname, file.path)
      console.log(file.path, relPath)
      archive.append(fs.createReadStream(file.path), { name: relPath })
    })
    .on('end', function() {
      archive.finalize(function(err, written) {
        if (err) throw err
      })
    })
  
  return gzipper
}