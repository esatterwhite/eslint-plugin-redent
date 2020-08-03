'use strict'

const {
  isRequire
, isStaticRequire
, isBuiltin
, isScoped
, isLocal
, isTopLevel
} = require('./common/require-type.js')

const DEFAULT_SORT_ORDER = ['static', 'builtin', 'contrib', 'scoped', 'local']

module.exports = {
  meta: {
    type: 'suggestion'
  , docs: {
      description: 'enforce grouped require declarations by scope'
    , category: 'LogDNA'
    }
  , schema: [
      {
        type: 'object'
      , properties: {
          typeOrder: {
            type: 'array'
          , items: {
              'enum': DEFAULT_SORT_ORDER
            }
          , uniqueItems: true
          , minItems: 5
          , maxItems: 5
          }
        }
      , additionalProperties: false
      }
    ]
  }
, create(context) {
    const configuration = context.options[0] || {}
    const {typeOrder = DEFAULT_SORT_ORDER} = configuration
    const nodes = []

    return {
      ExpressionStatement(node) {
        if (!isTopLevel(node)) return
        if (!isStaticRequire(node.expression)) return
        nodes.push(node.expression)
      }
    , VariableDeclaration(node) {
        if (!isTopLevel(node)) return
        if (!isRequire(node)) return
        nodes.push(node)
      }
    , 'Program:exit'() {
        if (nodes.length < 2) return

        let previousNode = nodes[0]
        for (let i = 1; i < nodes.length; i++) {
          const node = nodes[i]
          const currentIndex = getRequireTypeIndex(typeOrder, node)
          const previousIndex = getRequireTypeIndex(typeOrder, previousNode)
          if (currentIndex < previousIndex) {
            context.report({
              node
            , message: "Expected '{{syntaxA}}' require before '{{syntaxB}}' require."
            , data: {
                syntaxA: typeOrder[currentIndex]
              , syntaxB: typeOrder[previousIndex]
              }
            })
          }
          previousNode = node
        }
      }
    }
  }
}

function getRequireType(node) {
  if (isStaticRequire(node)) return 'static'
  if (isBuiltin(node)) return 'builtin'
  if (isScoped(node)) return 'scoped'
  if (isLocal(node)) return 'local'
  return 'contrib'
}

function getRequireTypeIndex(typeOrder, node) {
  return typeOrder.indexOf(getRequireType(node))
}
