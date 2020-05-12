
'use strict';

import _ from '../lib/lodash.js';
import utils from '../lib/utils.js';
import should from 'should';
// import DataFactory from 'n3';
// const factory = DataFactory
import * as N3 from 'n3';
const factory = N3.default.DataFactory

export default () => {

  describe('RdfStore.prototype.import()', () => {

    it('should import a single quad correctly', async function () {
      const store = this.store;
      const quads = [
        factory.quad(
          factory.namedNode('http://ex.com/s'),
          factory.namedNode('http://ex.com/p'),
          factory.literal('o', 'en-gb'),
          factory.namedNode('http://ex.com/g')
        )
      ];
      const source = utils.createArrayStream(quads);
      await utils.waitForEvent(store.import(source), 'end', true);
      const matchedQuads = await utils.streamToArray(store.match());
      should(matchedQuads).have.length(1);
    });

    it('should import multiple quads correctly', async function () {
      const store = this.store;
      const quads = [
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
      const source = utils.createArrayStream(quads);
      await utils.waitForEvent(store.import(source), 'end', true);
      const matchedQuads = await utils.streamToArray(store.match());
      should(matchedQuads).have.length(3);
    });

  });
};
