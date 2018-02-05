﻿import nj from '../core';
import * as tools from './tools';

function _createRegExp(reg, mode) {
  return new RegExp(reg, mode);
}

//Clear the repeated characters
function _clearRepeat(str) {
  let ret = '',
    i = 0,
    l = str.length,
    char;

  for (; i < l; i++) {
    char = str[i];
    if (ret.indexOf(char) < 0) {
      ret += char;
    }
  }

  return ret;
}

function _replace$(str) {
  return str.replace(/\$/g, '\\$');
}

function _replaceMinus(str) {
  return str.replace(/\-/g, '\\-');
}

export default function createTmplRule(rules = {}, isGlobal) {
  let {
    startRule = '{{',
      endRule = '}}',
      extensionRule = '#',
      propRule = '@',
      strPropRule = '@',
      templateRule = 'template',
      tagSpRule = '#$@',
      commentRule = '#'
  } = nj.tmplRule;

  let {
    start,
    end,
    extension,
    prop,
    strProp,
    template,
    tagSp,
    comment
  } = rules;

  if (start) {
    startRule = start;
  }
  if (end) {
    endRule = end;
  }
  if (extension) {
    extensionRule = extension;
  }
  if (prop) {
    propRule = prop;
  }
  if (strProp) {
    strPropRule = strProp;
  }
  if (template) {
    templateRule = template;
  }
  if (tagSp) {
    tagSpRule = tagSp;
  }
  if (comment != null) {
    commentRule = comment;
  }

  const firstChar = startRule[0],
    lastChar = endRule[endRule.length - 1],
    allRules = firstChar + lastChar,
    extensionRules = _replaceMinus(_clearRepeat(extensionRule + propRule + strPropRule + tagSpRule)),
    escapeExtensionRule = _replace$(extensionRule),
    escapePropRule = _replace$(propRule),
    escapeStrPropRule = _replace$(strPropRule);

  const tmplRules = {
    startRule,
    endRule,
    extensionRule,
    propRule,
    strPropRule,
    templateRule,
    tagSpRule,
    commentRule,
    firstChar,
    lastChar,
    xmlOpenTag: _createRegExp('^<([a-z' + firstChar + extensionRules + '][^\\s>]*)[^>]*>$', 'i'),
    openTagParams: _createRegExp('[\\s]+((([' + firstChar + ']?' + startRule + ')((?!' + endRule + ')[\\s\\S]+?)(' + endRule + '[' + lastChar + ']?))|[^\\s=>]+)(=((\'[^\']+\')|("[^"]+")|([^"\'\\s]+)))?', 'g'),
    insideBraceParam: _createRegExp('([' + firstChar + ']?' + startRule + ')((?!' + endRule + ')[\\s\\S]+?)(' + endRule + '[' + lastChar + ']?)', 'ig'),
    spreadProp: _createRegExp('[\\s]+([' + firstChar + ']?' + startRule + ')[\\s]*(\\.\\.\\.(?!' + endRule + ')[\\s\\S]+?)(' + endRule + '[' + lastChar + ']?)', 'g'),
    replaceSplit: _createRegExp('(?:[' + firstChar + ']?' + startRule + ')(?!' + endRule + ')[\\s\\S]+?(?:' + endRule + '[' + lastChar + ']?)'),
    replaceParam: _createRegExp('([' + firstChar + ']?' + startRule + ')((?!' + endRule + ')[\\s\\S]+?)' + endRule + '[' + lastChar + ']?', 'g'),
    checkElem: _createRegExp('([^<>]+)|(<([a-z/!' + firstChar + extensionRules + '][^\\s<>]*)([^<>]*)>|<)([^<]*)', 'ig'),
    extension: _createRegExp('^' + escapeExtensionRule + '([^\\s]+)', 'i'),
    exAll: _createRegExp('^([/]?)(' + escapeExtensionRule + '|' + escapeStrPropRule + escapePropRule + '|' + escapePropRule + ')([^\\s]+)', 'i'),
    include: _createRegExp('<' + escapeExtensionRule + 'include([^>]*)>', 'ig'),
    incompleteStart: _createRegExp('[' + firstChar + ']?' + startRule + '((?!' + endRule + ')[\\s\\S])*$'),
    incompleteEnd: _createRegExp('^(?!' + startRule + ')[\\s\\S]*?' + endRule + '[' + lastChar + ']?')
  };

  if (isGlobal) { //Reset the regexs to global list
    tools.assign(nj.tmplRule, tmplRules);
  } else {
    return tmplRules;
  }
};

//Set global template rules
createTmplRule({}, true);