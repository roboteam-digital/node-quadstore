
'use strict';

import isFunction from 'lodash.isfunction'
import isObject   from 'lodash.isobject'
import isString   from 'lodash.isstring'
import isNumber   from 'lodash.isnumber'
import isNil      from 'lodash.isnil'
import isBoolean  from 'lodash.isboolean'
import flatMap    from 'lodash.flatmap'
import mapValues  from 'lodash.mapvalues'
import find       from 'lodash.find'
import defaults   from 'lodash.defaults'

const isArray = Array.isArray
const extend = Object.assign

export default {
    isFunction,
    isObject,
    isString,
    isNumber,
    isNil,
    isArray,
    isBoolean,
    flatMap,
    mapValues,
    find,
    defaults,
    extend,
}
