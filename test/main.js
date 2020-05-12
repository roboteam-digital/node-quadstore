
'use strict';

import os from 'os';
import fs from 'fs-extra';
import util from 'util';
import path from 'path';
import nanoid from 'nanoid';
import memdown from 'memdown';
import leveldown from 'leveldown';
import rdfStoreSuite from './rdfstore.js';
import quadStoreSuite from './quadstore.js';

const remove = util.promisify(fs.remove);

describe('MemDOWN backend', () => {

  beforeEach(async function () {
    this.db = memdown();
  });

  quadStoreSuite();
  rdfStoreSuite();

});

describe('LevelDOWN backend', () => {

  beforeEach(async function () {
    this.location = path.join(os.tmpdir(), 'node-quadstore-' + nanoid());
    this.db = leveldown(this.location);
  });

  afterEach(async function () {
    await remove(this.location);
  });

  quadStoreSuite();
  rdfStoreSuite();

});
