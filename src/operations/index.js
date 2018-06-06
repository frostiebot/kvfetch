let operations

/**
 * _Somewhat_ cleaner version of getting the right set of operation
 * function mappings into the store, based on the current runtime
 * environment.
 *
 * Again, we don't test this, because I think it would make mocha
 * break down and cry.
 */

/* istanbul ignore else */
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  operations = require('./in-memory-store').default
} else {
  /* istanbul ignore next */
  operations = require('./flat-cache-store').default
}

export default operations
