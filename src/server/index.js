import app from './app'
import createStoreHandlers from './handlers'

/**
 * Returns an express application object ready to be started with `app.listen`
 *
 * @param {Object} store
 */
const createStoreServer = store => {
  const { handlePrefetchItem, handleGetItem, handlePutItem } = createStoreHandlers(store)

  app
    .route('/:key')
    .all(handlePrefetchItem)
    .get(handleGetItem)
    .put(handlePutItem)

  return app
}

export default createStoreServer
