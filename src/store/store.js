import path from 'path'

import flatCache from 'flat-cache'

/**
 * Honestly, this module is a little embarrasing.
 *
 * A store is essentially just a regular javascript Object, but it
 * is assumed that there would be some additional functions available
 * on the store to ease data access/manipulation.
 *
 * Additionally, the store should provide some way to persist itself
 * after a consuming process ends.
 *
 * Still. This is definitely fudgy and I am blanking right now on
 * what to do about it entirely... Possibly switch to TypeScript to
 * provide a Store interface? Kinda overkill...
 */

let storeFn = () => flatCache.create('memory')

if (process.env.MODE_ENV !== 'test') {
  storeFn = () => flatCache.load(path.resolve(__dirname, '../../store.dat'))
}

// TODO: Why did I not just make this the default export? WHY DID I DO ANY OF THIS?
export const getStore = storeFn
