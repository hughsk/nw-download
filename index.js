var versions  = require('nw-versions')
var through   = require('through2')
var request   = require('request')
var url       = require('url')

var source    = 'http://dl.node-webkit.org'
var platforms = {
    osx: '{{v}}/node-webkit-{{v}}-osx-ia32.zip'
  , win: '{{v}}/node-webkit-{{v}}-win-ia32.zip'
  , linux32: '{{v}}/node-webkit-{{v}}-linux-ia32.tar.gz'
  , linux64: '{{v}}/node-webkit-{{v}}-linux-x64.tar.gz'
}

module.exports = download

function download(platform, opts) {
  if (typeof opts === 'string') opts = { version: opts }

  opts = opts || {}

  if (!platforms[platform]) throw new Error(
    'Invalid platform: ' + platform
  )

  var stream   = through(write)
  var progress = 0
  var total    = 0

  if (opts.version === 'latest') opts.version = false
  if (opts.version) return next(opts.version), stream

  versions.latest(function(err, latest) {
    if (err) return stream.emit('error', err)
    next(latest)
  })

  return stream

  function next(version) {
    if (version.charAt(0) !== 'v') version = 'v' + version

    var src = platforms[platform].replace(/\{\{v}}/g, version)
    var uri = url.resolve(source, src)

    request.head(uri, function(err, res) {
      if (err) return stream.emit('error', err)
      total = parseInt(res.headers['content-length'], 10)
      request.get(uri).pipe(stream)
    })
  }

  function write(data, _, next) {
    this.push(data)
    stream.emit('progress'
      , (progress += data.length) / total
      , progress
      , total
    )

    next()
  }
}
