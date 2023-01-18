'use strict';

import assert from 'assert';
import sinon from 'sinon';
import Knifecycle, { constant } from 'knifecycle';
import initRandomService from './random';

describe('initRandomService', () => {
  const log = sinon.stub();

  beforeEach(() => {
    log.reset();
  });

  test('should work', (done) => {
    initRandomService({
      log,
    })
      .then((random) => {
        assert('function' === typeof random);
        assert.deepEqual(log.args, [
          ['debug', '🎲 - Random service initialized.'],
        ]);
      })
      .then(() => done())
      .catch(done);
  });

  describe('random', () => {
    test('should work', (done) => {
      initRandomService({
        log,
      })
        .then((random) => {
          log.reset();
          const num = random();

          assert.deepEqual(log.args, [
            ['debug', '🎲 - Created a random number:', num],
          ]);
        })
        .then(() => done())
        .catch(done);
    });
  });

  test('should work with Knifecycle', (done) => {
    new Knifecycle()
      .register(initRandomService)
      .register(constant('log', log))
      .run(['random'])
      .then(({ random }) => {
        assert(random);
        assert.deepEqual(log.args, [
          ['debug', '🎲 - Random service initialized.'],
        ]);
      })
      .then(() => done())
      .catch(done);
  });
});
