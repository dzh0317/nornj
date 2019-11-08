﻿import nj from '../core';
import * as tools from '../utils/tools';
import { checkElem } from '../parser/checkElem';
import * as tranData from '../transforms/transformData';
import { buildRuntime } from './buildRuntime';
import { compileStringTmpl } from '../parser/checkStringElem';
import { createTmplRule } from '../utils/createTmplRule';

//编译模板并返回转换函数
function _createCompile(outputH?) {
  return (tmpl, tmplKey, fileName?, delimiters?, tmplRule?) => {
    if (!tmpl) {
      return;
    }
    if (tools.isObject(tmplKey)) {
      const options = tmplKey;
      tmplKey = options.tmplKey;
      fileName = options.fileName;
      delimiters = options.delimiters;
      tmplRule = options.tmplRule;
    }

    //编译模板函数
    let tmplFns;
    if (tmplKey) {
      tmplFns = nj.templates[tmplKey];
    }
    if (!tmplFns) {
      const isObj = tools.isObject(tmpl);
      let fns;
      if (isObj && tmpl.main) {
        //直接传入预编译模板
        fns = tmpl;
      } else {
        //编译AST
        let root;
        if (tmplKey) {
          root = nj.asts[tmplKey];
        }
        if (!root) {
          //Can be directly introduced into the AST
          if (isObj && tmpl.type === 'nj_root') {
            root = tmpl;
          } else {
            if (!tmplRule) {
              tmplRule = delimiters ? createTmplRule(delimiters) : nj.tmplRule;
            }
            root = _createAstRoot();

            //Transform string template to preAst
            if (tools.isString(tmpl)) {
              tmpl = compileStringTmpl.call({ tmplRule, outputH, onlyParse: true, fileName }, tmpl);
            }

            //分析传入参数并转换为节点树对象
            checkElem(tmpl._njTmpl, root, tmplRule);
          }

          //保存模板AST编译结果到全局集合中
          if (tmplKey) {
            nj.asts[tmplKey] = root;
          }
        }

        fns = buildRuntime(root.content, root, !outputH);
      }

      tmplFns = tranData.template(fns, tmplKey);

      //保存模板函数编译结果到全局集合中
      if (tmplKey) {
        nj.templates[tmplKey] = tmplFns;
      }
    }

    return tmplFns.main;
  };
}

export const compile = _createCompile();
export const compileH = _createCompile(true);

//Create template root object
function _createAstRoot() {
  const root = tools.obj();
  root.type = 'nj_root';
  root.content = [];

  return root;
}

//Precompile template
export function precompile(tmpl, outputH, tmplRule, hasAst) {
  const root = _createAstRoot();

  if (tmpl.quasis) {
    const { quasis, isExpression, isCss } = tmpl;
    tmpl = compileStringTmpl.call(
      {
        tmplRule,
        outputH,
        onlyParse: true,
        isExpression,
        isCss
      },
      quasis
    );
  } else if (tools.isString(tmpl)) {
    tmpl = compileStringTmpl.call({ tmplRule, outputH, onlyParse: true }, tmpl);
  }
  checkElem(tmpl._njTmpl, root, tmplRule);

  const tmplFns = buildRuntime(root.content, root, !outputH);
  if (hasAst) {
    return {
      fns: tmplFns,
      ast: root
    };
  } else {
    return tmplFns;
  }
}

function _createRender(outputH?) {
  return function(tmpl, options) {
    return (outputH ? compileH : compile)(
      tmpl,
      options
        ? {
          tmplKey: options.tmplKey ? options.tmplKey : tmpl._njTmplKey,
          fileName: options.fileName,
          delimiters: options.delimiters
        }
        : tmpl._njTmplKey
    ).apply(null, tools.arraySlice(arguments, 1));
  };
}

export const render = _createRender();
export const renderH = _createRender(true);

function _buildRender(outputH?) {
  return function(tmpl, params) {
    const tmplMainFn = (outputH ? compileH : compile)(tmpl, tmpl._njTmplKey);
    if (params) {
      const tmplFn = function() {
        return tmplMainFn.apply(this, tools.arrayPush([params], arguments));
      };
      tools.defineProp(params, '_njParam', {
        value: true
      });
      tools.defineProps(tmplFn, {
        _njTmpl: {
          value: true
        }
      });

      return tmplFn;
    }

    return tmplMainFn;
  };
}

export const buildRender = _buildRender();
export const buildRenderH = _buildRender(true);

tools.assign(nj, {
  compile,
  compileH,
  precompile,
  render,
  renderH,
  buildRender,
  buildRenderH
});
