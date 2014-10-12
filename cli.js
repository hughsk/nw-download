#!/usr/bin/env node

var argv     = require('minimist')(process.argv.slice(2))
var versions = require('nw-versions')
var semver   = require('semver')
var os       = require('os')
var fs       = require('fs')
var dl       = require('./')

var platform = argv.platform || argv.p
if (!platform) {
  switch (platform = process.platform) {
    case 'darwin': platform = 'osx'; break
    case 'win32': break;
    default: platform = os.arch() === 'x64'
      ? 'linux64'
      : 'linux32'
  }
}

var dest = argv._.shift()
if (!dest) return bail('Please specify a destination filename')

var range = argv.range || argv.r || 'latest'
if (range === 'latest') range = 'x'

while (range.split('.').length < 3) {
  range = range + '.x'
}

versions(function(err, versions) {
  if (err) throw err
  var max  = semver.maxSatisfying(versions, range)
  var down = dl(platform, max)

  down.pipe(output(dest))

  if (!process.stderr.isTTY) return

  var progress = require('progress-bar').create(process.stderr, 30)
  var chalk    = require('chalk')

  progress.symbols.loaded = chalk.green('#')
  progress.symbols.notLoaded = chalk.black('-')

  down.on('progress', progress.update.bind(progress))
})

function bail(err) {
  err && console.error('\n'+err+'\n')

  fs.createReadStream(__dirname + '/usage.txt')
    .once('close', function() {
      console.error()
      process.exit(1)
    })
    .pipe(process.stderr)
}

function output(file) {
  return file === '-'
    ? process.stdout
    : fs.createWriteStream(file)
}
