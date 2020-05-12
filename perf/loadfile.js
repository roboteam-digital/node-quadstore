
'use strict';

import n3 from 'n3';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import utils from '../lib/utils.js';
import Promise from 'bluebird';
import shortid from 'shortid';
import { RdfStore } from '..';
import leveldown from 'leveldown';
import { DataFactory as dataFactory } from 'n3';
import childProcess from 'child_process';

function du(absPath) {
  return new Promise((resolve, reject) => {
    childProcess.exec(`du -sm ${absPath}`, (err, stdout) => {
      if (err) reject(err);
      else resolve(`${stdout.split(/\s+/)[0]} MB`);
    });
  });
}

const remove = Promise.promisify(fs.remove, { context: 'fs' });

(async () => {

  const args = process.argv.slice(2);

  const filePath = args[0];
  const format = args[1] || 'text/turtle';

  if (!filePath) {
    console.log('\n\n  USAGE: node scripts/perf/loadfile.js <filePath>\n\n');
    return;
  }

  const absStorePath = path.join(os.tmpdir(), `node-quadstore-${shortid.generate()}`);

  const store = new RdfStore(leveldown(absStorePath), { dataFactory });

  await utils.waitForEvent(store, 'ready');

  const absFilePath = path.resolve(process.cwd(), filePath);

  const fileReader = fs.createReadStream(absFilePath);
  const streamParser = n3.StreamParser({ format });

  const beforeTime = Date.now();
  await store.putStream(fileReader.pipe(streamParser));
  const afterTime = Date.now();

  await store.close();

  const diskUsage = await du(absStorePath);

  console.log(`TIME: ${(afterTime - beforeTime) / 1000} s`);
  console.log(`DISK: ${diskUsage}`);

  await remove(absStorePath);

})();
