'use strict'

const path = require('path')
const Module = require('module')

function has(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function resolveFrom(fromDir, moduleId) {
  fromDir = path.resolve(fromDir)
  const fromFile = path.join(fromDir, 'noop.js')

  try {
    return Module._resolveFilename(moduleId, {
      id: fromFile
    , filename: fromFile
    , paths: Module._nodeModulePaths(fromDir)
    })
  } catch (err) {
    return null
  }
}

const internalModules = new Set(Object.keys(process.binding('natives')))

module.exports = {
  meta: {
    type: 'problem'

  , docs: {
      description: 'disallow requires that are not in package.json'
    }
  , schema: [
      {
        enum: ['always', 'never']
      }
    , {
        type: 'object'
      , properties: {
          root: {
            type: 'string'
          }
        }
      , additionalProperties: false
      }
    ]
  , messages: {
      missingDependency: 'Missing dependency: "{{name}}". Not listed in package.json'
    , invalidRequire: 'Missing require: {{path}}. Path does not exist'
    }
  }

, create(context) {
    // First we need to find the neareast package.json
    const options = context.options[0] || {}
    const root = options.root || process.cwd()
    const pkgPath = path.join(root, 'package.json')
    const pkgOnDisk = require(pkgPath)
    const pkg = {
      dependencies: {}
    , devDependencies: {}
    , peerDependencies: {}
    , ...pkgOnDisk
    }

    function visit(node) {

      function check(name) {
        if (name[0] === '.' || name[0] === '/') {
          // Local module
          const parent = path.dirname(context.getFilename())
          if (!resolveFrom(parent, name)) {
            context.report({
              node
            , messageId: 'invalidRequire'
            , data: {
                path: name
              }
            })
          }
        } else {
          // Non local module
          if (internalModules.has(name)) return
          if (has(pkg.dependencies, name)) return
          if (has(pkg.devDependencies, name)) return
          if (has(pkg.peerDependencies, name)) return

          context.report({
            node
          , messageId: 'missingDependency'
          , data: {
              name
            }
          })
        }
      }

      if (node.type !== 'CallExpression') {
        return
      }

      const {callee} = node
      if (callee.type !== 'Identifier') {
        return
      }

      if (callee.name !== 'require') {
        return
      }

      if (node.arguments.length) {
        const arg = node.arguments[0]
        if (arg.type === 'Literal') {
          const name = arg.value
          check(name)
        } else if (arg.type === 'TemplateLiteral') {
          if (arg.quasis.length === 1 && arg.expressions.length === 0) {
            const name = arg.quasis[0].value.raw
            check(name)
          }
        }
      }
    }

    const handlers = {
      CallExpression: visit
    }

    return handlers
  }
}
