import { autoService, options } from 'knifecycle';

function noop() {}

export interface LogService {
  (...args: any[]): void;
}

export enum StdStream {
  STD_OUT = 'STD_OUT',
  STD_ERR = 'STD_ERR',
}

export interface Logger {
  [name: string]: LogService;
}

// Fallbacking to silent logs making logging
// opt-in. It appears to be the best default
// since logs are easy to get but won't disturb
// tests.
export const DEFAULT_LOGGER = {
  debug: noop, // eslint-disable-line
  error: noop, // eslint-disable-line
  info: noop, // eslint-disable-line
  warning: noop, // eslint-disable-line
};

export const DEFAULT_LOG_ROUTING = {
  error: StdStream.STD_ERR,
  // The stack type allows to filter logs in testing
  // since the stack files paths vary between systems
  // and it is annoying to filter them
  stack: StdStream.STD_ERR,
  warning: StdStream.STD_ERR,
  info: StdStream.STD_OUT,
};

/* Architecture Note #1.1: Logging

I prefer using a unique function with the log type
 in parameter instead of several methods for each
 log types. It is far easyer to mock and to assert
 on logs in my tests.

If provided, I route debug messages to the `debug`
 node module.

*/

export default options({ singleton: true }, autoService(initLog), true);

/**
 * Instantiate the logging service
 * @name initLog
 * @function
 * @param  {Object}   services
 * The services to inject
 * @param  {Object}   [services.logger = DEFAULT_LOGGER]
 * The logger to use
 * @param  {Function} [services.debug = noop]
 * A debugging function
 * @return {Promise<Function>}
 * A promise of the logging function
 * @example
 * import initLog from 'common-services/dist/log';
 *
 * const log = await initLog({
 *   logger: require('winston'),
 *   debug: require('debug')('myapp'),
 *  });
 */
async function initLog({
  LOG_ROUTING = DEFAULT_LOG_ROUTING,
  logger = DEFAULT_LOGGER,
  debug = noop,
}: {
  LOG_ROUTING?: { [type: string]: StdStream };
  logger?: Logger;
  debug?: LogService;
}) {
  log('debug', '👣 - Logging service initialized.');

  return log;

  /**
   * Logging function
   * @param  {String}  type
   * Log type
   * @param  {...*}    args
   * Log contents
   * @return {void}
   * @example
   * log('debug', 'Luke, I am your father!')
   */
  function log(type: string, ...args: any[]): void {
    if (LOG_ROUTING[type] === StdStream.STD_ERR) {
      logger.error(...args);
      return;
    }
    if (LOG_ROUTING[type] === StdStream.STD_OUT) {
      logger.info(...args);
      return;
    }
    debug(...args);
  }
}
