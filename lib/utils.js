
'use strict';

import _ from './lodash.js';
import stream from 'readable-stream';

function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

function streamToArray(readStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readStream
      .on('data', (chunk) => { chunks.push(chunk); })
      .on('end', () => { resolve(chunks); })
      .on('error', (err) => { reject(err); });
  });
}

function streamToString(readStream) {
  return new Promise((resolve, reject) => {
    let buffer = '';
    readStream
      .on('data', (chunk) => { buffer += chunk.toString(); })
      .on('end', () => { resolve(buffer); })
      .on('error', (err) => { reject(err); });
  });
}

function isReadableStream(obj) {
  return _.isObject(obj)
    && _.isFunction(obj.on)
    && _.isFunction(obj.read);
}

function isPromise(obj) {
  return _.isObject(obj)
    && _.isFunction(obj.then);
}

function isAbstractLevelDownClass(obj) {
  return _.isFunction(obj)
    && _.isFunction(obj.prototype.batch)
    && _.isFunction(obj.prototype.iterator);
}

function isAbstractLevelDOWNInstance(obj) {
  return _.isObject(obj)
    && _.isFunction(obj.put)
    && _.isFunction(obj.del)
    && _.isFunction(obj.batch);
}

function createArrayStream(arr) {
  let i = 0;
  const l = arr.length;
  return new stream.Readable({
    objectMode: true,
    read() {
      this.push(i < l ? arr[i++] : null);
    }
  });
}

function resolveOnEvent(emitter, event, rejectOnError) {
  return new Promise((resolve, reject) => {
    emitter.on(event, resolve);
    if (rejectOnError) {
      emitter.on('error', reject);
    }
  });
}

const waitForEvent = resolveOnEvent;

class IteratorStream extends stream.Readable {
  constructor(iterator) {
    super({ objectMode: true });
    const is = this;
    this._reading = false;
    this._iterator = iterator;
    this._iterator.on('end', () => {
      is.push(null);
    });
  }
  _read() {
    const is = this;
    is._startReading();
  }
  _startReading() {
    const is = this;
    if (is._reading) return;
    is._reading = true;
    is._iterator.on('data', (quad) => {
      if (!is.push(quad)) {
        is._stopReading();
      }
    });
  }
  _stopReading() {
    const is = this;
    is._iterator.removeAllListeners('data');
    is._reading = false;
  }
}

function createIteratorStream(iterator) {
  return new IteratorStream(iterator);
}

function wrapError(err, message) {
  const wrapperError = new Error(message);
  wrapperError.stack += '\nCaused by:' + err.stack;
  return wrapperError;
}

function defineReadOnlyProperty(obj, key, value) {
  Object.defineProperty(obj, key, {
    value,
    writable: false,
    enumerable: true,
    configurable: true
  });
}

function mapToObj(map) {
  const obj = {};
  for (const prop of map) {
    obj[prop[0]] = prop[1];
  }
  return obj;
}

function createMapToObjTransformStream() {
  return new stream.Transform({
    objectMode: true,
    transform(map, enc, cb) {
      this.push(mapToObj(map));
      cb();
    }
  })
}

function noop() {}

export default { wait, waitForEvent, streamToArray, streamToString, isReadableStream, isPromise, isAbstractLevelDownClass, isAbstractLevelDOWNInstance, createArrayStream, resolveOnEvent, createIteratorStream, wrapError, defineReadOnlyProperty, mapToObj, createMapToObjTransformStream, noop };
