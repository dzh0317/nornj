// http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format#answer-4673436
function formatString(format) {
  var args = Array.prototype.slice.call(arguments, 1);
  return format.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] !== 'undefined' ? args[number] : match;
  });
}

function throwError(errorMsg, infos) {
  throw new Error(
    [
      exports.renderErrorMessage(errorMsg, infos),
      ' at ',
      infos.file.opts.filename,
      ': ',
      infos.node.loc.start.line,
      ',',
      infos.node.loc.start.column
    ].join('')
  );
}

var ERRORS = exports.ERRORS = {
  NO_ATTRIBUTE: 'Attribute "{0}" is required for <{1}>, but missing!',
  NOT_EXPRESSION_TYPE: 'Attribute "{0}" of <{1}> tag must be an expression, e.g. "{0}={ ... }"',
  NOT_STRING_TYPE: 'Attribute "{0}" of <{1}> tag must be of type String, e.g. {0}="..."',
  SWITCH_WITHOUT_CASE: '<switch> statement requires at least one <case> element!',
  SWITCH_WITH_WRONG_CHILDREN: 'Only <case> and <default> are allowed child elements for <switch>!',
  SWITCH_DEFAULT_NOT_LAST: '<default> must be the last element within a <switch> statement!',
  SWITCH_WITH_MULTIPLE_DEFAULT: '<switch> statement allows only for one <default> block!'
};

exports.renderErrorMessage = function(errorMsg, infos) {
  var args = [];
  if (infos) {
    args.push(infos.attribute);
    args.push(infos.element);
  }
  return formatString(errorMsg, args);
};

exports.throwNoAttribute = function(attributeName, infos) {
  infos.attribute = attributeName;
  throwError(ERRORS.NO_ATTRIBUTE, infos);
};

exports.throwNotExpressionType = function(attributeName, infos) {
  infos.attribute = attributeName;
  throwError(ERRORS.NOT_EXPRESSION_TYPE, infos);
};

exports.throwNotStringType = function(attributeName, infos) {
  infos.attribute = attributeName;
  throwError(ERRORS.NOT_STRING_TYPE, infos);
};

exports.throwSwitchWithWrongChildren = function(infos) {
  throwError(ERRORS.SWITCH_WITH_WRONG_CHILDREN, infos);
};

exports.throwSwitchDefaultNotLast = function(infos) {
  throwError(ERRORS.SWITCH_DEFAULT_NOT_LAST, infos);
};

exports.throwSwitchWithMultipleDefault = function(infos) {
  throwError(ERRORS.SWITCH_WITH_MULTIPLE_DEFAULT, infos);
};

exports.throwSwitchWithoutCase = function(infos) {
  throwError(ERRORS.SWITCH_WITHOUT_CASE, infos);
};