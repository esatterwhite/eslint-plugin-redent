'use strict'

const {get} = require('dot-prop')
const {
  isRequire
, isLocal
} = require('./common/require-type.js')

const REQUIRE_EXTENSIONS = ['js', 'json', 'node']

module.exports = {
  meta: {
    type: 'suggestion'
  , docs: {
      description: 'enforce file extension for local modules/files'
    , category: 'LogDNA'
    }
  }
, create(context) {
    const nodes = []

    return {
      VariableDeclaration(node) {
        if (!isRequire(node)) return
        if (!isLocal(node)) return
        nodes.push(node)
      }
    , 'Program:exit'() {
        for (const node of nodes) {
          const path = get(node, 'declarations.0.init.arguments.0.value')
          const parts = path.split('.')
          const hasExtension = parts.length && REQUIRE_EXTENSIONS.includes(parts[parts.length - 1])
          if (!hasExtension) {
            context.report({
              node
            , message: 'Missing file extension for local module.'
            })
          }
        }
      }
    }
  }
}
