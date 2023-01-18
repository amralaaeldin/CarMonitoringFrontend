import assert from 'assert';
import sinon from 'sinon';
import YError from 'yerror';
import Knifecycle, { constant } from 'knifecycle';
import initProcessService from './process';

describe('Process service', () => {
  const log = sinon.stub();
  const savedProcessName = global.process.title;
  const processListenerStub = sinon.stub(global.process, 'on');
  let exit;
  let exitPromise;
  let fatalErrorDeferred;

  beforeEach(() => {
    exitPromise = new Promise((resolve) => {
      exit = sinon.spy(resolve);
    });
    processListenerStub.reset();
    log.reset();
  });

  afterEach(() => {
    global.process.title = savedProcessName;
  });

  describe('', () => {
    beforeEach((done) => {
      initProcessService({
        NODE_ENV: 'development',
        PROCESS_NAME: 'Kikooolol',
        log,
        exit,
        $instance: { destroy: () => Promise.resolve() } as Knifecycle,
        $fatalError: {
          promise: new Promise((resolve, reject) => {
            fatalErrorDeferred = { resolve, reject };
          }),
        },
      })
        .then(() => done())
        .catch(done);
    });

    test('should work', () => {
      assert.deepEqual(
        log.args,
        [
          ['warning', '🔂 - Running in "development" environment.'],
          ['debug', '📇 - Process service initialized.'],
        ],
        'Process initialization information',
      );
      assert.equal(global.process.title, 'Kikooolol - development');
      assert.deepEqual(
        processListenerStub.args.length,
        3,
        'Process fail/signals listened',
      );
    });

    test('should handle fatal errors', (done) => {
      fatalErrorDeferred.reject(new YError('E_AOUCH'));

      exitPromise
        .then(() => {
          assert.deepEqual(exit.args, [[1]]);
        })
        .then(() => done())
        .catch(done);
    });

    test('should handle uncaught exceptions', (done) => {
      processListenerStub.args.find(
        (call) => 'uncaughtException' === call[0],
      )[1](new YError('E_AOUCH'));

      exitPromise
        .then(() => {
          assert.deepEqual(exit.args, [[1]]);
        })
        .then(() => done())
        .catch(done);
    });

    ['SIGINT', 'SIGTERM'].forEach((signal) =>
      test('should handle `signal`', (done) => {
        processListenerStub.args.find((call) => signal === call[0])[1](
          new YError('E_AOUCH'),
        );

        exitPromise
          .then(() => {
            assert.deepEqual(exit.args, [[0]]);
          })
          .then(() => done())
          .catch(done);
      }),
    );
  });

  test('should work with Knifecycle', (done) => {
    new Knifecycle()
      .register(initProcessService)
      .register(constant('log', log))
      .register(constant('NODE_ENV', 'production'))
      .register(constant('exit', exit))
      .run(['process'])
      .then(() => {
        assert.deepEqual(log.args, [
          ['warning', '🔂 - Running in "production" environment.'],
          ['debug', '📇 - Process service initialized.'],
        ]);
      })
      .then(() => done())
      .catch(done);
  });
});
