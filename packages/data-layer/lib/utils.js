"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.traverse = traverse;
exports.reduceToSQL = reduceToSQL;


var identity = function identity(a) {
  return a;
};
function traverse(node, iterator, xform, accum) {
  accum = xform(accum, iterator(node));
  var source = node.getState().source;
  return (typeof source === "undefined" ? "undefined" : _typeof(source)) === "object" && !Array.isArray(source) ? traverse(source, iterator, xform, accum) : accum;
}

function reduceToSQL(context, node) {
  var initialSQL = {
    select: [],
    from: "",
    where: [],
    groupby: [],
    having: [],
    orderby: [],
    limit: "",
    offset: "",
    unresolved: {}
  };

  function toSQL(accum, rightNode) {
    return context.parser.parseDataState(rightNode.getState(), accum);
  }

  return traverse(node, identity, toSQL, initialSQL);
}