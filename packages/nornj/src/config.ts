﻿import nj from './core';
import { assign } from './utils/tools';
import { createTmplRule } from './utils/createTmplRule';

export function config(configs) {
  const { delimiters, includeParser, createElement, outputH, textMode, noWsMode, fixTagName } = configs;

  if (delimiters) {
    createTmplRule(delimiters, true);
  }

  if (includeParser) {
    nj.includeParser = includeParser;
  }

  if (createElement) {
    nj.createElement = createElement;
  }

  if (outputH != null) {
    nj.outputH = outputH;
  }

  if (textMode != null) {
    nj.textMode = textMode;
  }

  if (noWsMode != null) {
    nj.noWsMode = noWsMode;
  }

  if (fixTagName != null) {
    nj.fixTagName = fixTagName;
  }
}

assign(nj, {
  config
});
