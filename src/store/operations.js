import { getStore } from './store'

const _store = getStore()

/**
 * Returns an object containing the data and version related to the given key
 *
 * @param {String} key
 */
export const getItem = key => _store.getKey(key) || { data: undefined, version: 0 }

/**
 * Sets the data of an item with the given key and bumps the version.
 * If the value passed in is identical to the existing data, no change
 * is made.
 *
 * @param {String} key
 * @param {String} value
 */
export const setItem = (key, value) => {
  let { data, version } = getItem(key)
  if (value !== data) {
    _store.setKey(key, { data: value, version: version + 1 })
  }
}

/**
 * Removes the item for the given key from the store.
 *
 * This function is purposely not exposed in the HTTP service.
 *
 * @param {String} key
 */
export const deleteItem = key => _store.removeKey(key)

/**
 * Persists the datastore to the filesystem.
 * Used when the server process exits
 */
export const persist = () => _store.save(true)
