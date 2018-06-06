import createOperations from './operations'

/**
 * Returns a store object built from a mapping of operation functions
 *
 * @param {Object} operations
 */
const createStore = operations => createOperations(operations)

export default createStore
