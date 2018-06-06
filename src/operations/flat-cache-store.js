import path from 'path'

import flatCache from 'flat-cache'

/**
 * An implementation of operations mapping using a real backing store.
 *
 * The `flatCache` library is basically a glorified wrapper around
 * a file which may or may not exist.
 *
 * Regardless of the existence of the file, the real store is
 * actually a normal Object that is filled with the parsed data from
 * the file (if it exists) or simply an empty Object (if the file
 * does not exist).
 *
 * The persist function simply ensures the contents of the store are
 * dumped verbatim into the specified file (creating it if necessary)
 * and saved.
 *
 * The `flatCache.save` function is crucially a synchronous call to
 * persist the file on disk - this allows us to ensure the data in
 * the store _will_ be saved during process exit. If it were an async
 * call, the process would just exit and would likely corrupt the file
 * it was trying to write asynchronously.
 */

const fcStore = flatCache.load(path.resolve(__dirname, '../../store.dat'))

export default {
  getItem: key => fcStore.getKey(key),
  setItem: (key, value) => fcStore.setKey(key, value),
  deleteItem: key => fcStore.removeKey(key),
  clear: () => fcStore.destroy(),
  persist: () => fcStore.save(true)
}
