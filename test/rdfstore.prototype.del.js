
'use strict';

import _ from '../lib/lodash.js';
import utils from '../lib/utils.js';
import should from 'should';
// import DataFactory from 'n3';
// const factory = DataFactory
import * as N3 from 'n3';
const factory = N3.default.DataFactory


export default () => {

  describe('RdfStore.prototype.del()', () => {

    it('Should delete matching quads correctly (callback).', async function () {
      const store = this.store;
      const quads = [
        factory.quad(
          factory.namedNode('http://ex.com/s0'),
          factory.namedNode('http://ex.com/p0'),
          factory.literal('o0', 'en-gb'),
          factory.namedNode('http://ex.com/g0')
        ),
        factory.quad(
          factory.namedNode('http://ex.com/s0'),
          factory.namedNode('http://ex.com/p1'),
          factory.literal('o1', 'en-gb'),
          factory.namedNode('http://ex.com/g1')
        ),
        factory.quad(
          factory.namedNode('http://ex.com/s2'),
          factory.namedNode('http://ex.com/p1'),
          factory.literal('o2', 'en-gb'),
          factory.namedNode('http://ex.com/g1')
        )
      ];
      await store.put(quads);
      await store.del({ subject: factory.namedNode('http://ex.com/s0') });
      const foundQuads = await store.get({});
      should(foundQuads).have.length(1);
    });
  });

};
