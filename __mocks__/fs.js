const { fs } = require('memfs');

// Patch memfs FsReadStream and FsWriteStream to respect autoClose: false in _destroy.
// In memfs, _destroy unconditionally calls this.close() which closes the fd even if autoClose is false.
if (fs.ReadStream && fs.ReadStream.prototype) {
  fs.ReadStream.prototype._destroy = function (err, cb) {
    if (this.autoClose) {
      this.close(err2 => {
        cb(err || err2);
      });
    } else {
      cb(err);
    }
  };
}

if (fs.WriteStream && fs.WriteStream.prototype) {
  fs.WriteStream.prototype._destroy = function (err, cb) {
    if (this.autoClose) {
      this.close(err2 => {
        cb(err || err2);
      });
    } else {
      cb(err);
    }
  };
}

fs.__mock__ = true;
module.exports = fs;

