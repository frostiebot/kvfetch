const createOperations = operations => {
  /**
   * Simple private helper to make item objects
   * Returns an object with the keys `data` and `version`
   *
   * @param {String?} data
   * @param {Number?} version
   */
  const _makeItem = (data = undefined, version = 0) => ({ data, version })

  /**
   * Returns an object containing the data and version related to the given key
   *
   * @param {String} key
   */
  const getItem = key => operations.getItem(key) || _makeItem()

  /**
   * Sets the data of an item with the given key and bumps the version.
   * If the value passed in is identical to the existing data, no change
   * is made.
   *
   * @param {String} key
   * @param {String} value
   */
  const setItem = (key, value) => {
    let { data, version } = getItem(key)
    if (value !== data) {
      // _store.setKey(key, { data: value, version: version + 1 })
      operations.setItem(key, _makeItem(value, version + 1))
    }
  }

  /**
   * Removes the item for the given key from the store.
   *
   * This function is purposely not exposed in the HTTP service.
   *
   * @param {String} key
   */
  const deleteItem = key => operations.deleteItem(key)


  /**
   * Empties the store associated with the current set of operations
   * Used during testing
   */
  const clear = () => operations.clear()

  /**
   * Persists the datastore to the filesystem.
   * Used when the server process exits
   */
  const persist = () => operations.persist()

  return { getItem, setItem, deleteItem, clear, persist }
}

export default createOperations
