'use strict'

const isBuiltinModule = require('is-builtin-module')
const {get} = require('dot-prop')

module.exports = {
  isRequire
, isStaticRequire
, isBuiltin
, isScoped
, isLocal
, isTopLevel
}

function isRequire(node) {
  const value = get(node, 'declarations.0.init.callee.name')
  return !!(value && value === 'require')
}

function isStaticRequire(node) {
  if (!node || node.type !== 'CallExpression') return false
  const calleeType = get(node, 'callee.type')
  const calleeName = get(node, 'callee.name')

  return (
    node.arguments.length === 1
      && calleeType === 'Identifier'
      && calleeName === 'require'
  )
}

function isScoped(node) {
  const value = get(node, 'declarations.0.init.arguments.0.value')
  return !!(value && value.startsWith('@'))
}

function isBuiltin(node) {
  const value = get(node, 'declarations.0.init.arguments.0.value')
  return !!(value && isBuiltinModule(value))
}

function isLocal(node) {
  const value = get(node, 'declarations.0.init.arguments.0.value')
  return !!(value && value.startsWith('.'))
}

function isTopLevel(node) {
  const value = get(node, 'parent.type')
  return !!(value && value === 'Program')
}
