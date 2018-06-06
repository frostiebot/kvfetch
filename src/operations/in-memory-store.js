/**
 * The "default" key/value store.
 *
 * Essentially a template that indicates how to implement operations
 * for other backing stores.
 *
 * In this case, the store is simply an empty Object
 */

let imStore = {}

export default {
  getItem: key => imStore[key],
  setItem: (key, value) => imStore[key] = value,
  deleteItem: key => delete imStore[key],
  clear: () => imStore = {},
  persist: () => true
}
