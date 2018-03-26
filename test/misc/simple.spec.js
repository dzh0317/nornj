﻿'use strict';

const nj = require('../../src/base').default,
  _ = require('lodash'),
  compile = require('../../src/compiler/compile').compile,
  moment = require('moment');

describe('test compile string', function() {
  beforeAll(function() {

  });

  describe('compile string template to html', function() {
    it('test compile simple', function() {


      var tmpl = nj `
        <${'div'} class="{{id}} {{name3}}" {{name3}} {{ ...props}} name={{name1}} autofocus name1={{a.c.d}} name2="{{ [a[a.e['h']].f.g, 2] }}" a="/%'aaa'%/" {{... Object.assign({ e: 0 }, ${{ a: '...123', b: 2 }}, { c: 3 }) }} {{... ${{ g: '...123', b: 20 }} }}>
          <#prop {{'name1' | vm-var}} />
          {{1 + ${2} + 3 + ${4}}}
          {{111}}
          {{{
            JSON.stringify([{
              a: { c: 1 },
              b: [2, { d: 5 }]
            }, { e: 10 }])
          }}}
          {{ { a: 1 } }}
          {{ 20.5 | int * (10.05 | float) + (2 ** 3) + (19 // 2) }}
          {{ [1, 2, 3].length + [1].push(100) }}
          {{ -10 ..< 10 }}
          {{1 >(0) ?('+','')}}
          {{ a._ }}
          {{ a.#prop }}
          {{ { a: 1 }.a }}
          <#once name="test">
            <i>test</i>
          </#once>
          <#each {{1 .. 10}}>
            {{@root.test}}
            {{@context.data[2].a.b}}
            {{../@context.data[1].a.b}}
            <#each {{1 .. 2}}>
              {{../../@context.data[1].a.b}}
            </#each>
          </#each>
          {{ set a.b = '__cde' }}{{ a.b }}
          <#if {{ a._ > 100 }}>{{ set x = '__yzx' }}</#if>{{ x }}
        </${'div'}>
      `;



      var html = tmpl({
        a: {
          b: '__abc',
          c: {
            d: 'bcd'
          },
          e: {
            f: {
              g: 'efg'
            },
            h: 'e'
          },
          _: 123,
          prop: ctx => 456
        },
        x: '__xyz'
      });
      //console.log(html);
      expect(html).toBeTruthy();
    });
  });
});