import app from './app'
import createAppHandlers from './handlers'

/**
 * Returns an express application object ready to be started with `app.listen`
 *
 * @param {Object} store
 */
const createApp = store => {
  const { handlePrefetchItem, handleGetItem, handlePutItem } = createAppHandlers(store)

  app
    .route('/:key')
    .all(handlePrefetchItem)
    .get(handleGetItem)
    .put(handlePutItem)

  return app
}

export default createApp
