# eslint-plugin-sensible

Better comma first indent rules for eslint, and other sane defaults

### Rules

* redent: Fixes punctuation and operator indent to work better with comma first settings
* check-require: Ensures that all packages that are `required` are installed in package.json or exist locally
* grouped-require: Enforce sorted (by scope) require declarations within modules
* require-file-extension: Ensures require statements contain a file extension for local modules/files

```javascript
'use strict'

const path = require('path')
const fs = require('fs')
const {promisify} = require('util')
const crypto = require('crypto')

const readFile = promisify(fs.readFile)
const EXP = /\d+/
const SLEEP_MS = 150

const LONG_STRING = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz'
  + 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz'
  + 'abcdefghijklmnopqrstuvwxyz'

const OPTIONS = {
  FOO: 1
, BAR: 2
, TEST: 'fake'
, LONG: LONG_STRING
}

const isFoo = OPTIONS.FOO
  ? OPTIONS.BAR
  : OPTIONS.TEST

function getOptions() {
  return isFoo ? OPTIONS : null
}

function rand(bytes = 10, cb) {
  crypto.randomBytes(bytes, (err, buffer) => {
    if (err) return cb(err)
    cb(null, buffer.toString('hex'))
  })
}

async function doWork(opts) {
  const {x, y} = opts
  try {
    const file = await readFile(path.join(x, y))
    return file
  } catch (err) {
    console.error(err)
    return null
  }
}

;(async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, SLEEP_MS)
  })
  console.log('ready', 11 + 33)
})()

module.exports = {
  ...OPTIONS
, EXP
, rand
, getOptions
, doWork
}
```
