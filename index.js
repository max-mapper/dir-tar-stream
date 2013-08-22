var fs = require('fs')
var path = require('path')
var zlib = require('zlib')
var ls = require('ls-stream')
var archiver = require('archiver')
var concat = require('concat-stream')

module.exports = streamFolder

function streamFolder(dir) {
  var gzipper = zlib.createGzip()
  var archive = archiver('tar')
  var emptyBuffer = new Buffer(0)
  var done
  var pending = 0
  
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
        archive.append(emptyBuffer, { name: relPath })
      } else {
        pending++
        fs.createReadStream(file.path).pipe(concat(function(buf) {
          archive.append(buf, { name: relPath })
          finish()
        }))
      }
    })
    .on('end', function() {
      done = true
    })
  
  function finish() {
    pending--
    if (pending !== 0 || !done) return
    archive.finalize(function(err, written) {
      if (err) throw err
    })
  }

  return gzipper
}