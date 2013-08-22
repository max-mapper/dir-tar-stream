var fs = require('fs')
var path = require('path')
var zlib = require('zlib')
var ls = require('ls-stream')
var archiver = require('archiver')

module.exports = streamFolder

function streamFolder(dir) {
  var gzipper = zlib.createGzip()
  var archive = archiver('tar')
  var emptyBuffer = new Buffer(0)

  archive.on('error', function(err) {
    throw err
  })

  archive.pipe(gzipper)

  ls(dir)
    .on('data', function(file) {
      if (!file.stat.isFile()) return
      var relPath = path.relative(dir, file.path)
      var fileData
      if (file.stat.size === 0) {
        fileData = emptyBuffer
      } else  {
        fileData = fs.createReadStream(file.path)
        fileData.on('data', function() { })
      }
      archive.append(fileData, { name: relPath })
    })
    .on('end', function() {
      archive.finalize(function(err, written) {
        if (err) throw err
      })
    })
  
  return gzipper
}