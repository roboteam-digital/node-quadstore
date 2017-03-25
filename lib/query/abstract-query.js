/* eslint no-this-before-super: off */

'use strict';

const _ = require('lodash');
const assert = require('assert');

let JoinQuery;
let SortQuery;
let UnionQuery;
let FilterQuery;

function isTermName(str) {
  return {
    subject: true,
    predicate: true,
    object: true,
    graph: true
  }[str] || false;
}

function isTermNameArray(arr) {
  return _.isArray(arr)
    && _.reduce(arr, (acc, item) => acc && isTermName(item));
}

class AbstractQuery {

  constructor(store, parent) {
    this._store = store;
    this._parent = parent;
    this._queryType = 'abstract';
  }

  sort(termNames, reverse) {
    if (_.isNil(reverse)) reverse = false;
    assert(isTermNameArray(termNames), 'The "termNames" argument is not an array of term names.');
    assert(_.isBoolean(reverse), 'The "reverse" argument is not boolean.');
    return new SortQuery(this._store, this, termNames, reverse);
  }

  join(query, termNames) {
    assert(_.isObject(query), 'The "query" argument is not a query.');
    assert(_.isString(query._queryType), 'The "query" argument is not a query.');
    assert(isTermNameArray(termNames), 'The "termNames" argument is not an array of term names.');
    return new JoinQuery(this._store, this, query, termNames);
  }

  union(query) {
    assert(_.isObject(query) && _.isString(query._queryType), 'The "query" argument is not a query.');
    return new UnionQuery(this._store, this, query);
  }

  filter(fn) {
    assert(_.isFunction(fn), 'The "fn" argument is not a function.');
    return new FilterQuery(this._store, this, fn);
  }

  toReadableStream(cb) {
    const query = this;
    assert(_.isNil(cb) || _.isFunction(cb), 'The "cb" argument is not a function.');
    function _toReadableStream(resolve, reject) {
      query._execute((executeErr, readableStream) => {
        if (executeErr) { reject(executeErr); return; }
        resolve(readableStream);
      });
    }
    if (!_.isFunction(cb)) {
      return new Promise(_toReadableStream);
    }
    _toReadableStream(cb.bind(null, null), cb);
  }

  toArray(cb) {
    const query = this;
    assert(_.isNil(cb) || _.isFunction(cb), 'The "cb" argument is not a function.');
    function _toArray(resolve, reject) {
      const quads = [];
      query._execute((executeErr, readableStream) => {
        if (executeErr) { reject(executeErr); return; }
        readableStream
          .on('data', (quad) => { quads.push(quad); })
          .on('end', () => { resolve(quads); })
          .on('error', (streamErr) => { reject(streamErr); });
      });
    }
    if (!_.isFunction(cb)) {
      return new Promise(_toArray);
    }
    _toArray(cb.bind(null, null), cb);
  }

  _execute(cb) {
    cb(new Error('This is an instance of AbstractQuery() and cannot be executed.'));
  }

}

module.exports = AbstractQuery;

JoinQuery = require('./join-query');
SortQuery = require('./sort-query');
UnionQuery = require('./union-query');
FilterQuery = require('./filter-query');