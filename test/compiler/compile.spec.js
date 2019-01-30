import nj from '../../src/core';
import { precompile } from '../../src/compiler/compile';
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
    const tmpl = `<div>
      {{1 + 2 ** 3 - 4 * 5 %% (6 + 7)}}
      <#tmpl>{123}</#tmpl>
      <!--#
      {{'111'.length + 2 * 3}}
      {{' 123 '.trim() + 4 - 5 ** 6}}
      {{ { a: 1, b: 2 }.b * 100 }}
      {{[1, 2, 3][0] + 100}}
      {{'abcde'.substring(1, num.getLength()).length * 5}}
      #-->
    </div>`;

    const ast = {
      "prop": {
        "filters": [{
          "params": [{
            "name": "2",
            "isBasicType": true
          }],
          "name": "+"
        },
        {
          "params": [{
            "name": "3",
            "isBasicType": true
          }],
          "name": "**"
        },
        {
          "params": [{
            "name": "4",
            "isBasicType": true
          }],
          "name": "-"
        },
        {
          "params": [{
            "name": "5",
            "isBasicType": true
          }],
          "name": "*"
        },
        {
          "params": [{
            "filters": [{
              "params": [{
                "name": "7",
                "isBasicType": true
              }],
              "name": "+"
            }],
            "name": "6",
            "isBasicType": true
          }],
          "name": "%%"
        }],
        "name": "1",
        "isBasicType": true
      },
      "escape": true
    };

    function _buildPropData() {
    
    }

    const ret = precompile(tmpl, true, nj.tmplRule);

    const gCode = `
      1 + p1.f['**'](2, 3) - 4 * p1.f['%%'](5, 6 + 7)

      p1.f['.']('111', 'length') + 2 * 3

      var _v0 = p1.f['.'](' 123 ', 'trim');
      (_v0 && _v0()) + 4 - p1.f['**'](5, 6)

      p1.f['.']({ a: 1, b: 2 }, 'b') * 100

      p1.f['.']([1, 2, 3], 0) + 100

      var _v0 = p1.f['.']('abcde', 'substring');
      var _v1 = p1.f['.'](p2.d('num'), 'getLength');
      p1.f['.']((_v0 && _v0(1, (_v1 && _v1()))), 'length') * 5
    `;

    console.log(ret.main.toString());
    // var _v0 = null;
    // console.log('1' + (_v0 && _v0()) + 3);
  });
});