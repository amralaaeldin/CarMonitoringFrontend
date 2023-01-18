import assert from 'assert';
import sinon from 'sinon';
import Knifecycle, { constant } from 'knifecycle';
import initCounterService from './counter';

describe('initCounterService', () => {
  const log = sinon.stub();

  beforeEach(() => {
    log.reset();
  });

  test('should work', async () => {
    const counter = await initCounterService({
      log,
    });

    assert('function' === typeof counter);
    assert.deepEqual(log.args, [
      ['debug', '📇 - Counter service initialized.'],
    ]);
  });

  describe('counter', () => {
    test('should work', async () => {
      const counter = await initCounterService({
        log,
      });

      log.reset();

      const num = await counter();

      assert.deepEqual(log.args, [['debug', '📇 - Picked a count:', num]]);
    });
  });

  test('should work with Knifecycle', async () => {
    const { counter } = await new Knifecycle()
      .register(initCounterService)
      .register(constant('log', log))
      .run(['counter']);

    assert(counter);
    assert.deepEqual(log.args, [
      ['debug', '📇 - Counter service initialized.'],
    ]);
  });
});
