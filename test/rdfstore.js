/* eslint global-require: "off" */


'use strict';

import utils from '../lib/utils.js';
import RdfStore from '../lib/rdfstore.js';

import rdfstore_prototype_match         from './rdfstore.prototype.match.js'
import rdfstore_prototype_del           from './rdfstore.prototype.del.js'
import rdfstore_prototype_remove        from './rdfstore.prototype.remove.js'
import rdfstore_prototype_import        from './rdfstore.prototype.import.js'
import rdfstore_prototype_removematches from './rdfstore.prototype.removematches.js'

export default () => {

  describe('RdfStore', () => {

    beforeEach(async function () {
      this.store = new RdfStore(this.db);
      await utils.waitForEvent(this.store, 'ready');
    });

    afterEach(async function () {
      await this.store.close();
    });

    rdfstore_prototype_match()
    rdfstore_prototype_del()
    rdfstore_prototype_remove()
    rdfstore_prototype_import()
    rdfstore_prototype_removematches()

    // require('./rdfstore.prototype.match')();
    // require('./rdfstore.prototype.del')();
    // require('./rdfstore.prototype.remove')();
    // require('./rdfstore.prototype.import')();
    // require('./rdfstore.prototype.removematches')();

  });
};
