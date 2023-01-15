'use strict'

const path = require('path')
const fs = require('fs')

const {RuleTester} = require('eslint')
const rule = require('../../../lib/rules/indent')

const fixture_path = path.join(__dirname, '..', '..', 'fixtures')
const basic = fs.readFileSync(path.join(fixture_path, 'valid'), 'utf8')
const range_error = fs.readFileSync(path.join(fixture_path, 'range-error'), 'utf8')
const chaining = fs.readFileSync(path.join(fixture_path, 'optional-chaining'), 'utf8')
const inconsistent_whitespace = fs.readFileSync(
  path.join(fixture_path, 'inconsistent-whitespace')
, 'utf8'
)

const Suite = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020
  , sourceType: 'module'
  }
, rules: {
    "indent": 0
  }
})

Suite.run('redent', rule, {
  valid: [
    {code: inconsistent_whitespace}
  , {code: range_error}
  , {code: chaining}
  , {code: basic}
  ]
, invalid: [{
    code: 'var x = {\n  a: 1\n  , b: 2\n}\n'
  , output: 'var x = {\n  a: 1\n, b: 2\n}\n'
  , errors: [{
      message: 'Expected indentation of 0 spaces but found 2.'
    , type: 'Punctuator'
    }]
  }]
})
