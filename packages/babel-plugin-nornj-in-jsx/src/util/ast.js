const nj = require('nornj/dist/nornj.common').default;
const utils = require('./utils');
const traverse = require('@babel/traverse').default;
const types = require('@babel/types');

const TYPES = {
  ELEMENT: 'JSXElement',
  EXPRESSION_CONTAINER: 'JSXExpressionContainer',
  STRING_LITERAL: 'StringLiteral'
};

function getTagName(node) {
  return node.openingElement.name.name;
}

/**
 * Test if this is a custom JSX element with the given name.
 *
 * @param {object} node - Current node to test
 * @param {string} tagName - Name of element
 * @returns {boolean} whether the searched for element was found
 */
exports.isTag = function(node, tagName) {
  return node.type === TYPES.ELEMENT && getTagName(node) === tagName;
};

/**
 * Tests whether this is an JSXExpressionContainer and returns it if true.
 *
 * @param {object} attribute - The attribute the value of which is tested
 * @returns {boolean}
 */
exports.isExpressionContainer = function(attribute) {
  return attribute && attribute.value.type === TYPES.EXPRESSION_CONTAINER;
};

/**
 * Get expression from given attribute.
 *
 * @param {JSXAttribute} attribute
 * @returns {Expression}
 */
exports.getExpression = function(attribute) {
  return attribute.value.expression;
};

/**
 * Tests whether this is an StringLiteral and returns it if true.
 *
 * @param {object} attribute - The attribute the value of which is tested
 * @returns {boolean}
 */
exports.isStringLiteral = function(attribute) {
  return attribute && attribute.value.type === TYPES.STRING_LITERAL;
};

/**
 * Get all attributes from given element.
 *
 * @param {JSXElement} node - Current node from which attributes are gathered
 * @returns {object} Map of all attributes with their name as key
 */
exports.getAttributeMap = function(node) {
  let spreadCount = 1;
  return node.openingElement.attributes.reduce(function(result, attr) {
    if (attr.argument) {
      result['_nj_spread' + spreadCount++] = attr;
    } else {
      result[attr.name.name] = attr;
    }
    return result;
  }, {});
};

/**
 * Get the string value of a node's key attribute if present.
 *
 * @param {JSXElement} node - Node to get attributes from
 * @returns {object} The string value of the key attribute of this node if present, otherwise undefined.
 */
exports.getKey = function(node) {
  const key = exports.getAttributeMap(node).key;
  return key ? key.value.value : undefined;
};

/**
 * Get all children from given element. Normalizes JSXText and JSXExpressionContainer to expressions.
 *
 * @param {object} babelTypes - Babel lib
 * @param {JSXElement} node - Current node from which children are gathered
 * @returns {array} List of all children
 */
exports.getChildren = function(babelTypes, node) {
  return babelTypes.react.buildChildren(node);
};

/**
 * Adds attribute "key" to given node, if not already preesent.
 *
 * @param {object} babelTypes - Babel lib
 * @param {JSXElement} node - Current node to which the new attribute is added
 * @param {string} keyValue - Value of the key
 */
const addKeyAttribute = (exports.addKeyAttribute = function(babelTypes, node, keyValue) {
  let keyFound = false;

  node.openingElement.attributes.forEach(function(attrib) {
    if (babelTypes.isJSXAttribute(attrib) && attrib.name.name === 'key') {
      keyFound = true;
      return false;
    }
  });

  if (!keyFound) {
    const keyAttrib = babelTypes.jSXAttribute(babelTypes.jSXIdentifier('key'), babelTypes.stringLiteral('' + keyValue));
    node.openingElement.attributes.push(keyAttrib);
  }
});

function isReactCreateElement(types, expr) {
  return (
    types.isCallExpression(expr) &&
    expr.callee &&
    expr.callee.object &&
    expr.callee.object.name === 'React' &&
    expr.callee.property &&
    expr.callee.property.name === 'createElement'
  );
}

function addKeyAttributeByReactCreateElement(types, node, keyValue) {
  if (types.isNullLiteral(node.arguments[1])) {
    node.arguments[1] = types.objectExpression([
      types.objectProperty(types.identifier('key'), types.stringLiteral(keyValue + ''))
    ]);
  } else {
    let keyFound = false;
    const properties = node.arguments[1].properties;

    if (properties) {
      properties.forEach(function(attrib) {
        if (attrib.key.name === 'key') {
          keyFound = true;
          return false;
        }
      });

      if (!keyFound) {
        properties.push(types.objectProperty(types.identifier('key'), types.stringLiteral(keyValue + '')));
      }
    }
  }
}

/**
 * Return either a NullLiteral (if no content is available) or
 * the single expression (if there is only one) or an ArrayExpression.
 *
 * @param babelTypes - Babel lib
 * @param blocks - the content blocks
 * @param keyPrefix - a prefix to use when automatically generating keys
 * @returns {NullLiteral|Expression|ArrayExpression}
 */
exports.getSanitizedExpressionForContent = function(babelTypes, blocks, keyPrefix) {
  if (!blocks.length) {
    return babelTypes.NullLiteral();
  } else if (blocks.length === 1) {
    const firstBlock = blocks[0];

    if (keyPrefix && firstBlock.openingElement) {
      addKeyAttribute(babelTypes, firstBlock, keyPrefix);
    }

    return firstBlock;
  }

  for (let i = 0; i < blocks.length; i++) {
    const thisBlock = blocks[i];
    const key = keyPrefix ? keyPrefix + '-' + i : i;

    if (babelTypes.isJSXElement(thisBlock)) {
      addKeyAttribute(babelTypes, thisBlock, key);
    } else if (isReactCreateElement(babelTypes, thisBlock)) {
      addKeyAttributeByReactCreateElement(babelTypes, thisBlock, key);
    }
  }

  return babelTypes.arrayExpression(blocks);
};

function hasDirective(node) {
  return (
    node.openingElement &&
    node.openingElement.attributes.reduce(function(result, attr) {
      if (attr.name && isDirective(attr.name.name)) {
        result.push(attr.name.name);
      }
      return result;
    }, [])
  );
}
exports.hasDirective = hasDirective;

function isDirective(name) {
  if (name.indexOf('n-') === 0) {
    return true;
  }

  const exConfig = nj.extensionConfig[name.replace(REGEX_EX_ATTR, (all, name) => name)];
  return exConfig && exConfig.needPrefix == 'free';
}
exports.isDirective = isDirective;

exports.transformDirective = function(attrName) {
  if (attrName.indexOf('n-') === 0) {
    const ret = attrName.substr(2);
    return (ret === 'style' ? '' : 'n-') + ret;
  } else {
    return 'n-' + attrName;
  }
};

const REGEX_CAPITALIZE = /^[A-Z][\s\S]*$/;
exports.REGEX_CAPITALIZE = REGEX_CAPITALIZE;

const REGEX_EX_ATTR = /([^\s-$.]+)((-[^\s-$.]+)*)(([$.][^\s-$.]+)*)/;
exports.REGEX_EX_ATTR = REGEX_EX_ATTR;

exports.addImportNj = function(state) {
  const globalNj = state.addImport('nornj', 'default', 'nj');
  state.addImport('nornj-react');

  return globalNj;
};

function hasExPrefix(name) {
  return name.indexOf('n-') === 0 || name.indexOf('Nj') === 0;
}
exports.hasExPrefix = hasExPrefix;

const REGEX_LOWER_CASE = /^[a-z]/;
const REGEX_UPPER_CASE = /^[A-Z]/;

exports.isExTag = function(nodeName, opts = {}) {
  if (opts.onlyLowercaseExName && REGEX_UPPER_CASE.test(nodeName)) {
    return false;
  }

  const exPrefix = hasExPrefix(nodeName);
  let isSubTag;
  let needPrefix;
  if (exPrefix) {
    nodeName = nodeName.substr(2);
  }
  const exConfig = nj.extensionConfig[nj.lowerFirst(nodeName)];
  if (exConfig) {
    isSubTag = exConfig.isSubTag;
    needPrefix = exConfig.needPrefix;
  }

  let isExTag;
  if (exPrefix) {
    isExTag = !isSubTag;
  } else {
    isExTag =
      exConfig &&
      !isSubTag &&
      (!needPrefix ||
        (needPrefix == 'onlyUpperCase' && REGEX_LOWER_CASE.test(nodeName)) ||
        (needPrefix == 'onlyLowerCase' && REGEX_UPPER_CASE.test(nodeName)));
  }

  return isExTag;
};

exports.isSubExTag = function(node) {
  if (node.type !== TYPES.ELEMENT) {
    return false;
  }

  let nodeName = getTagName(node);
  if (nodeName == null) {
    return false;
  }

  const exPrefix = hasExPrefix(nodeName);
  let isSubTag;
  let needPrefix;
  if (exPrefix) {
    nodeName = nodeName.substr(2);
  }

  const exConfig = nj.extensionConfig[nj.lowerFirst(nodeName)];
  if (exConfig) {
    isSubTag = exConfig.isSubTag;
    needPrefix = exConfig.needPrefix;
  }

  return exPrefix
    ? isSubTag
    : isSubTag &&
        (!needPrefix ||
          (needPrefix == 'onlyUpperCase' && REGEX_LOWER_CASE.test(nodeName)) ||
          (needPrefix == 'onlyLowerCase' && REGEX_UPPER_CASE.test(nodeName)));
};

function hasMobxBind(path) {
  let hasMobxBind = false;
  traverse(
    path.node,
    {
      JSXIdentifier: {
        enter(path) {
          if (hasMobxBind) {
            return;
          }

          if (path.node.name.startsWith('n-mobxBind') || path.node.name.startsWith('mobxBind')) {
            hasMobxBind = true;
          }
        }
      }
    },
    path.scope,
    path.state,
    path
  );

  return hasMobxBind;
}
exports.hasMobxBind = hasMobxBind;
