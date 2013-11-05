var zlib = require('zlib')
var tar = require('tar')
var fstream = require('fstream')

module.exports = tgzStream

function tgzStream(folder, filename, includeRoot) {
  if (!filename) filename = "attachment.tar.gz"
  if (includeRoot !== false) includeRoot = true
  
  var reader = fstream.Reader({type: "Directory", path: folder})
  var pack = tar.Pack()
  var gzip = zlib.createGzip()
  var oldEmit = reader.emit
  
  if (!includeRoot) {
    reader.emit = function(ev, entry) {
      if (ev === "entry") entry.root = null
      return oldEmit.apply(reader, arguments)
    }
  }

  reader.pipe(pack).pipe(gzip)
  return gzip
}