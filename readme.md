# dir-tar-stream

update: you should use https://npmjs.org/package/tar-fs instead of this module

[![NPM](https://nodei.co/npm/dir-tar-stream.png)](https://nodei.co/npm/dir-tar-stream/)

Takes a path to a folder and returns a tar.gz stream of the folder contents.

```
require('dir-tar-stream')('./foo').pipe(fs.createWriteStream('foo.tar.gz'))
```

To extract the stream on the other end you can use the `tar` module like so:

```
var tar = require('tar')
dirTarStream.pipe(tar.Extract({path: './output'}))
```

## license

BSD
