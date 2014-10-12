# nw-download
![](http://img.shields.io/badge/stability-experimental-orange.svg?style=flat)
![](http://img.shields.io/npm/v/nw-download.svg?style=flat)
![](http://img.shields.io/npm/dm/nw-download.svg?style=flat)
![](http://img.shields.io/npm/l/nw-download.svg?style=flat)

Download a node-webkit archive for a specific platform/version.

## Usage

[![NPM](https://nodei.co/npm/nw-download.png)](https://nodei.co/npm/nw-download/)

### `stream = download(platform, version)`

Returns a stream of the `zip` or `tar.gz` file for this specific
platform/version combination. Accepts the following platforms:

* `win`: Windows 32-bit (.zip)
* `osx`: Mac 32-bit (.zip)
* `linux32`: Linux 32-bit (.tar.gz)
* `linux64`: Linux 64-bit (.tar.gz)

`version` is optional, and will default to `latest`.

### `stream.on('progress', fn(fraction, progress, total))`

Emitted periodically with the progress of the download.

* `fraction` is a number between 0 and 1 reporting the total progress of the
  download.
* `progress` is the total number of bytes downloaded.
* `total` is the total number of bytes to download.

## License

MIT. See [LICENSE.md](http://github.com/hughsk/nw-download/blob/master/LICENSE.md) for details.
