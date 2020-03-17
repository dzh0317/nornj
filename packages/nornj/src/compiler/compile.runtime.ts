import nj from '../core';
import * as tools from '../utils/tools';
import * as tranData from '../transforms/transformData';
import { Template } from '../interface';

//编译模板并返回转换函数
function _createCompile(outputH?: boolean) {
  return (tmpl, tmplKey, fileName?: string, delimiters?: object, tmplRule?: object) => {
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
      }

      tmplFns = tranData.template(fns);

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

function _createRender(outputH?: boolean) {
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

function _buildRender(outputH?: boolean) {
  return function(tmpl, params) {
    const tmplMainFn = (outputH ? compileH : compile)(tmpl, tmpl._njTmplKey);
    if (params) {
      const tmplFn = function(this: Template.Context) {
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
  render,
  renderH,
  buildRender,
  buildRenderH
});
