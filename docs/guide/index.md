---
title: 介绍
order: 1
nav:
  title: 指南
  order: 1
---

## 什么是 NornJ

`NornJ`，我们可以把它读作 `[ˌnɔ:nˈdʒeɪ]` 或简称 `nj`，它是一个基于 Babel 的 React JSX 新增语法扩展方案。**它的目标是创造出更简单、易读、实用的 JSX 写法，以及通过 JSX 语法扩展继续丰富 React 现有的组件复用思路。**

## 它能做什么

与其他的 Babel JSX 扩展（如[jsx-control-statements](https://github.com/AlexGilleran/jsx-control-statements)）类似， `NornJ` 内置了一些常用的 JSX 扩展如流程控制：

```js
ReactDOM.render(
  <>
    <if condition={isOk}>
      success
      <else>fail</else>
    </if>

    <for of={[1, 2, 3]}>
      <i>{item}</i>
    </for>
  </>,
  document.body
);
```

以及一些常用指令：

```js
ReactDOM.render(
  <>
    <img n-show={isShow} />

    <input n-debounce={200} onChange={e => console.log(e.target.value)} />
  </>,
  document.body
);
```

还包括 Babel 配合 Tagged Templates 语法实现的过滤器语法等：

```js
const num = 100;

ReactDOM.render(
  <>
    <i>{n`num | random(5000) | currency`}</i>
  </>,
  document.body
);
```

另外，和大多数 Babel 扩展不太一样的地方，它是一个可以支持扩展的方案。

## 它的可扩展能力

## 它的运作原理

## 它的运行时体积多大

## 它的性能

## 它的命名

<!-- # 关于 JSX 的思考

我们平时都编写`JSX`来创建 React 组件，`JSX`非常好用，能适应各种各样的场景。依现状不难列出和`JSX`有关的以下几个话题：

- 按目前`ecmascript`的语法特性来看，原生的`JSX`语法在编写各种 React 组件时都能很好的适配。只是一些特殊情况可能存在争议，如在编写逻辑判断时需要使用`ok ? <i>ok</i> : <i>no</i>`或`ok && <i>ok</i>`;

- 我们不时会拿`JSX`和`模板引擎`进行优劣对比：

  - `JSX`的主要优势：`更灵活适合编写复杂逻辑`、`完善的IDE代码静态检查`(如 typescript 的支持度)等;
  - `模板引擎`(例如 Vue 的模板)的主要优势：`更丰富的语法糖`、`组件逻辑与表现分离`(SFC)、`容易扩展更多的语法`(自定义过滤器、指令)等;

* `JSX`可以通过`babel`插件提供扩展，例如：

  - 属`css in js`技术的[styled-jsx](https://github.com/zeit/styled-jsx)：编译后有运行时代码，有`3kb gzip`的网络开销，但能提供不少`JSX`语法之外的辅助功能。
  - 提供`JSX`流程控制的[jsx-control-statements](https://github.com/AlexGilleran/jsx-control-statements)：编译后没有运行时代码，副作用小，但不可以支持扩展新的语法。

# 用 babel 插件让 JSX 吸收模板引擎的特性?

我们试想一下，`JSX`在如果在保持现有功能与特性的情况下，同时也拥有`模板引擎`的以下优点是不是会更好用？

- 更丰富的语法糖(指令、流程控制等)

- 容易扩展更多的语法糖

以上我们通过`babel`插件就可以实现。`NornJ`是我们创造的一个可扩展并可支持`React`的`模板引擎`; 而它提供的[配套 babel 插件](https://github.com/joe-sky/nornj/blob/master/packages/babel-plugin-nornj-in-jsx/README.md)则能够在用户并无感知的情况下，将`模板引擎`语法化整为零地插入到原生`JSX`中运行，如下：

```js
const test = props => (
  <if condition={props.isTest}>
    {' '}
    //此行为模板
    <i>success</i> //此行为原生JSX
    <else>
      {' '}
      //此行为模板
      <i>fail</i> //此行为原生JSX
    </else> //此行为模板
  </if> //此行为模板
);
```

下面的是一个在线可运行实例：

- [在线 Playground(codesandbox)](https://codesandbox.io/s/z2nj54r3wx) -->

<!-- # NornJ有哪些主要的语法糖

# 这些语法糖是如何工作的

# 扩展新的语法糖

# NornJ其实是个完整的模板引擎 -->
