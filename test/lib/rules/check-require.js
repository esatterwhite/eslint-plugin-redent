'use strict'

const path = require('path')
const fs = require('fs')

const {RuleTester} = require('eslint')
const rule = require('../../../lib/rules/check-require')

const fixture_path = path.join(__dirname, '..', '..', 'fixture')
const fixture = fs.readFileSync(fixture_path, 'utf8')

const Suite = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018
  , sourceType: 'script'
  }
, rules: {
    "check-require": 2
  }
})

Suite.run('check-require', rule, {
  valid: [
    {code: 'const a = require("http")'}
  , {code: fixture}
  ]
, invalid: [{
    code: 'const thing = require("biscuits")'
  , errors: [{
      message: 'Missing dependency: "biscuits". Not listed in package.json'
    }]
  }]
})
