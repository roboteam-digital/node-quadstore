
'use strict';

import _ from '../lib/lodash.js';
import utils from '../lib/utils.js';
import should from 'should';
// import DataFactory from 'n3';
// const factory = DataFactory
import * as N3 from 'n3';
const factory = N3.default.DataFactory

export default () => {

  describe('RdfStore.prototype.remove()', () => {

    it('should remove streamed quads correctly', async function () {
      const store = this.store;
      const importQuads = [
        factory.quad(
          factory.namedNode('http://ex.com/s0'),
          factory.namedNode('http://ex.com/p0'),
          factory.literal('o0', 'en-gb'),
          factory.namedNode('http://ex.com/g0')
        ),
        factory.quad(
          factory.namedNode('http://ex.com/s1'),
          factory.namedNode('http://ex.com/p1'),
          factory.literal('o1', 'en-gb'),
          factory.namedNode('http://ex.com/g1')
        ),
        factory.quad(
          factory.namedNode('http://ex.com/s2'),
          factory.namedNode('http://ex.com/p2'),
          factory.literal('o2', 'en-gb'),
          factory.namedNode('http://ex.com/g3')
        )
      ];
      const removeQuads = [
        factory.quad(
          factory.namedNode('http://ex.com/s1'),
          factory.namedNode('http://ex.com/p1'),
          factory.literal('o1', 'en-gb'),
          factory.namedNode('http://ex.com/g1')
        ),
        factory.quad(
          factory.namedNode('http://ex.com/s2'),
          factory.namedNode('http://ex.com/p2'),
          factory.literal('o2', 'en-gb'),
          factory.namedNode('http://ex.com/g3')
        )
      ];
      const importStream = utils.createArrayStream(importQuads);
      const removeStream = utils.createArrayStream(removeQuads);
      await utils.waitForEvent(store.import(importStream), 'end', true);
      await utils.waitForEvent(store.remove(removeStream), 'end', true);
      const matchedQuads = await utils.streamToArray(store.match());
      should(matchedQuads).have.length(1);
    });

  });

};
