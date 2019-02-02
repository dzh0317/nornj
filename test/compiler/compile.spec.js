import nj from '../../src/core';
import { render, precompile } from '../../src/compiler/compile';
import '../../src/utils/createTmplRule';

describe('Precompile', () => {
  nj.registerExtension('noMargin', options => {
    options.exProps.style = 'margin:0';
  }, { addSet: true });

  xit('Extension attribute', () => {
    const ret = precompile(`
      <div type="radio" #show={{show}} #noMargin-arg1-arg2.modifier1.modifier2={{show}}>
        <i><#test /></i>
      </div>
    `, true, nj.tmplRule);

    //console.log(ret.main.toString());
    expect(Object.keys(ret).length).not.toBe(8);
    expect(ret.main.toString()).toContain('p1.x[\'noMargin\']');
  });

  it('Simple', () => {
    //console.log(render(`<i>{{(1+2**3) %% 5+'_123'}}</i>`));

    //const REGEX_OPERATOR = /\+|-|\*|%|==|<=|>=|<|>|&&/;
    const OPERATORS = ['+', '-', '*', '%', '==', '<=', '>=', '<', '>', '&&'];

    const tmpl = `<div>
      {{ctrl('5', 2) ** 5}}
      <!--#
      <#tmpl>{123}</#tmpl>
      {{1 + 2 > 2 && 2 ** (3 + 1) <= 5 && (5 + 6 %% 7) >= 10}}
      {{1 + 2 ** 3 - 4 * 5 %% (6 + 7)}}
      {{'111'.length + 2 * 3}}
      {{' 123 '.trim() + 4 - 5 ** 6}}
      {{' 123 '.trim(1 + 2 %% 5, 123.length.toString(123)) + 4 - 5 ** 6}}
      {{ { a: 1, b: 2 }.b * 100 }}
      {{[1, 2, 3][0] + 100}}
      {{'abcde'.substring(1, num.getLength()).length * 5}}
      {{ { fn: param => param + 'abc'.substring(param, 10) } }}
      {{set a = '123' + '456'}}
      #-->
    </div>`;

    const ast = {
      "prop": {
        "filters": [{
          "params": [{
            "name": "'5'",
            "isBasicType": true
          },
          {
            "name": "2",
            "isBasicType": true
          }],
          "name": "ctrl"
        },
        {
          "params": [{
            "name": "5",
            "isBasicType": true
          }],
          "name": "**"
        }],
        "isEmpty": true
      },
      "escape": true
    };

    function _buildPropData(ast, escape) {
      let codeStr = (ast.filters && OPERATORS.indexOf(ast.filters[0].name) < 0) ? '' : ast.name;
      let lastCodeStr = '';

      ast.filters && ast.filters.forEach((filter, i) => {
        if (OPERATORS.indexOf(filter.name) >= 0) {
          codeStr += ` ${filter.name} `;

          if (!ast.filters[i + 1] || OPERATORS.indexOf(ast.filters[i + 1].name) >= 0) {
            if (filter.params[0].filters) {
              codeStr += '(';
              codeStr += _buildPropData(filter.params[0], escape);
              codeStr += ')';
            }
            else {
              codeStr += filter.params[0].name;
            }
          }
        }
        else if (filter.name === '_') {
          codeStr += '(';
          filter.params.forEach((param, i) => {
            codeStr += _buildPropData(param, escape);
            if (i < filter.params.length - 1) {
              codeStr += ', ';
            }
          });
          codeStr += ')';
        }
        else {
          const hasFilterBehind = ast.filters[i + 1] && OPERATORS.indexOf(ast.filters[i + 1].name) < 0;

          let _codeStr = `p1.f['${filter.name}'](`;
          if (i == 0) {
            _codeStr += ast.name;
          }
          else if (lastCodeStr !== '') {
            _codeStr += lastCodeStr;
          }
          else if (ast.filters[i - 1].params[0].filters) {
            _codeStr += _buildPropData(ast.filters[i - 1].params[0], escape);
          }
          else {
            _codeStr += ast.filters[i - 1].params[0].name;
          }
          _codeStr += ', ';
          if (filter.params[0].filters) {
            _codeStr += _buildPropData(filter.params[0], escape);
          }
          else {
            _codeStr += filter.params[0].name;
          }
          _codeStr += ')';

          if (hasFilterBehind) {
            lastCodeStr = _codeStr;
          }
          else {
            codeStr += _codeStr;
            lastCodeStr = '';
          }
        }
      });

      return codeStr;
    }

    console.log(_buildPropData(ast.prop, ast.escape));

    const ret = precompile(tmpl, true, nj.tmplRule);

    const gCode = `
      p1.f['**'](p1.f['ctrl']('5', 2), 5)

      p1.f['.'](p1.f['.'](p1.f['.'](a, 'b'), 'c'), 'd')

      1 + p1.f['**'](2, 3) - 4 * p1.f['%%'](5, 6 + 7)

      p1.f['.']('111', 'length') + 2 * 3

      var _v0 = p1.f['.'](' 123 ', 'trim');
      (_v0 && _v0()) + 4 - p1.f['**'](5, 6)

      p1.f['.']({ a: 1, b: 2 }, 'b') * 100

      p1.f['.']([1, 2, 3], 0) + 100

      var _v0 = p1.f['.']('abcde', 'substring');
      var _v1 = p1.f['.'](p2.d('num'), 'getLength');
      p1.f['.']((_v0 && _v0(1, (_v1 && _v1()))), 'length') * 5
      
      var _v0 = p1.f['.']('abc', 'substring');
      { fn: param => param + (_v0 && _v0(param, 10)) }

      p2.d('a', 0, true)._njCtx.a = '123' + '456'
    `;

    //console.log(ret.main.toString());
    // var _v0 = null;
    // console.log('1' + (_v0 && _v0()) + 3);
  });
});