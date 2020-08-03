'use strict'

const {RuleTester} = require('eslint')
const rule = require('../../../lib/rules/require-file-extension.js')

const Suite = new RuleTester({
  parserOptions: {
    ecmaVersion: 2019
  , sourceType: 'module'
  }
})

Suite.run('require-file-extension', rule, {
  valid: [
    {
      code: `
        const net = require('net')
        const foo = require('../test/foo.js')
        const bar = foo('./bar')
        if (bar) {
          const baz = require('./baz.json');
        }
      `
    }
  ]
, invalid: [
    {
      code: `
        const foo = require('../test/foo')
        if (bar) {
          const baz = require('./baz');
        }
      `
    , errors: [
        {message: 'Missing file extension for local module.'}
      , {message: 'Missing file extension for local module.'}
      ]
    }
  ]
})
