
'use strict';

import _ from '../lib/lodash.js';
import utils from '../lib/utils.js';
import QuadStore from '../lib/quadstore.js';

import quadstore_leveldb                 from './quadstore.leveldb.js'
import quadstore_prototype_get           from './quadstore.prototype.get.js'
import quadstore_prototype_put           from './quadstore.prototype.put.js'
import quadstore_prototype_del           from './quadstore.prototype.del.js'
import quadstore_prototype_patch         from './quadstore.prototype.patch.js'
import quadstore_prototype_registerindex from './quadstore.prototype.registerindex.js'
import quadstore_prototype_getbyindex    from './quadstore.prototype.getbyindex.js'

export default () => {

  describe('QuadStore', () => {

    beforeEach(async function () {
      this.store = new QuadStore(this.db);
      await utils.waitForEvent(this.store, 'ready');
    });

    afterEach(async function () {
      await this.store.close();
    });

    quadstore_leveldb()
    quadstore_prototype_get()
    quadstore_prototype_put()
    quadstore_prototype_del()
    quadstore_prototype_patch()
    quadstore_prototype_registerindex()
    quadstore_prototype_getbyindex()
    
    // require('./quadstore.leveldb')();
    // require('./quadstore.prototype.get')();
    // require('./quadstore.prototype.put')();
    // require('./quadstore.prototype.del')();
    // require('./quadstore.prototype.patch')();
    // require('./quadstore.prototype.registerindex')();
    // require('./quadstore.prototype.getbyindex')();

  });
};
