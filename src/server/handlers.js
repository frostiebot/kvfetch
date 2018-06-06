/**
 * Creates handlers for getting and setting a value into a store with
 * a given key
 *
 * @param {Object} store
 */
const createAppHandlers = store => {
  /**
   * Handles fetching an item for the given `key` route parameter
   * and places it into `res.locals` before calling `next` to continue
   * the handler chain.
   *
   * @param {Request} req
   * @param {Response} res
   * @param {function} next
   */
  const handlePrefetchItem = (req, res, next) => {
    res.locals.item = store.getItem(req.params.key)
    next()
  }

  /**
   * Returns the stored item value if it exists, otherwise returns 404
   *
   * @param {Request} req
   * @param {Response} res
   */
  const handleGetItem = (req, res) => {
    const { data, version } = res.locals.item

    if (data === undefined) {
      return res.sendStatus(404).end()
    }

    res.set({ 'ETag': `W/"${version}"` })
    res.send(data)
    res.end()
  }

  /**
   * Adds or Updates a value for a given key into the store.
   * In the case of an update, the `If-Match` header must be present
   * and have a value of the `ETag` header retrieved from
   * `handleGetItem`, otherwise the request will be rejected with a
   * 412 response.
   *
   * @param {Request} req
   * @param {Response} res
   */
  const handlePutItem = (req, res) => {
    const { version } = res.locals.item

    if (version > 0 && `W/"${version}"` !== req.get('if-match')) {
      return res.sendStatus(412).end()
    }

    store.setItem(req.params.key, req.body.value)
    res.sendStatus(200)
    res.end()
  }

  return { handlePrefetchItem, handleGetItem, handlePutItem }
}

export default createAppHandlers
