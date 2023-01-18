/* eslint max-nested-callbacks:0 */
import assert from 'assert';
import sinon from 'sinon';
import Knifecycle, { constant } from 'knifecycle';
import initDelayService from './delay';

describe('initDelayService', () => {
  const log = sinon.stub();

  beforeEach(() => {
    log.reset();
  });

  test('should work', async () => {
    const delay = await initDelayService({
      log,
    });

    assert('function' === typeof delay.service.create);
    assert('function' === typeof delay.service.clear);
    assert('function' === typeof delay.dispose);
    assert.deepEqual(log.args, [['debug', '⌛ - Delay service initialized.']]);
  });

  describe('delay.create', () => {
    let setTimeoutStub;

    beforeEach(() => {
      setTimeoutStub = sinon.stub(global, 'setTimeout');
    });

    afterEach(() => {
      setTimeoutStub.restore();
    });

    test('should work', async () => {
      const { service: delay } = await initDelayService({
        log,
      });

      let delayPromise;

      log.reset();
      setTimeoutStub.returns({});

      delayPromise = delay.create(1000);
      assert.equal(setTimeoutStub.args.length, 1);
      assert.equal(setTimeoutStub.args[0][1], 1000);
      assert.deepEqual(log.args, [['debug', '⏳ - Created a delay:', 1000]]);
      // Run set callback
      setTimeoutStub.args[0][0]();

      await delayPromise;
    });
  });

  describe('delay.clear', () => {
    let setTimeoutStub;
    let clearTimeoutStub;

    beforeEach(() => {
      setTimeoutStub = sinon.stub(global, 'setTimeout');
      clearTimeoutStub = sinon.stub(global, 'clearTimeout');
      setTimeoutStub.returns({});
    });

    afterEach(() => {
      setTimeoutStub.restore();
      clearTimeoutStub.restore();
    });

    test('should fail with bad promise', async () => {
      const { service: delay } = await initDelayService({
        log,
      });

      log.reset();

      await delay.clear(Promise.resolve()).catch((err) => {
        assert.equal(err.code, 'E_BAD_DELAY');
      });
    });

    test('should work', async () => {
      const { service: delay } = await initDelayService({
        log,
      });
      const delayPromise = delay.create(10000);

      await Promise.resolve();

      log.reset();

      await Promise.all([
        delay.clear(delayPromise),
        delayPromise.catch((err) => {
          assert.equal(err.code, 'E_DELAY_CLEARED');
        }),
      ]);
      assert.deepEqual(log.args, [['debug', '⏳ - Cleared a delay']]);
    });
  });

  test('should work with Knifecycle', async () => {
    const { delay } = await new Knifecycle()
      .register(initDelayService)
      .register(constant('log', log))
      .run(['delay']);

    assert(delay);
    assert.deepEqual(log.args, [['debug', '⌛ - Delay service initialized.']]);
  });
});
