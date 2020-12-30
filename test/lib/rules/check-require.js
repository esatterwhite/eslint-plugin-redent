'use strict'

const path = require('path')
const fs = require('fs')

const {RuleTester} = require('eslint')
const rule = require('../../../lib/rules/check-require')

const fixture_path = path.join(__dirname, '..', '..', 'fixture')
const fixture = fs.readFileSync(fixture_path, 'utf8')

{
  const Suite = new RuleTester({
    parserOptions: {
      ecmaVersion: 2018
    , sourceType: 'script'
    }
  })

  Suite.run('check-require', rule, {
    valid: [
      {code: 'const a = require("http")'}
    , {code: fixture}
    , {code: 'var a = require("eslint/lib/rules/utils/ast-utils")'}
    ]
  , invalid: [{
      code: 'const thing = require("biscuits")'
    , errors: [{
        message: 'Missing dependency: "biscuits". Not listed in package.json'
      }]
    }]
  })
}

{
  const Suite = new RuleTester({
    parserOptions: {
      ecmaVersion: 2018
    , sourceType: 'script'
    }
  })

  Suite.run('check-require', rule, {
    valid: [
      {code: 'const a = require("http")'}
    , {code: fixture}
    , {code: 'const thing = require("biscuits")', options: ["always", {root: __dirname}]}
    ]
  , invalid: [{
      code: 'var a = require("eslint/lib/rules/utils/ast-utils")'
    , options: ["always", {root: __dirname}]
    , errors: [{
        message: 'Missing dependency: "eslint". Not listed in package.json'
      }]
    }]
  })
}
