import * as operations from '../../src/store/operations'

describe('store', () => {

  describe('#setItem(key, value)', () => {
    const key = 'lemon'

    afterEach(() => {
      operations.deleteItem(key)
    })

    it('should set a new value into the store with a version of 1', () => {
      operations.setItem(key, 'curry')

      expect(operations.getItem(key)).to.deep.equal({ data: 'curry', version: 1 })
    })

    it('should not update an existing value in the store if the data did not change', () => {
      operations.setItem(key, 'curry')
      const existing = operations.getItem(key)

      operations.setItem(key, 'curry')

      expect(operations.getItem(key)).to.deep.equal(existing)
    })

    it('should update an existing value and increment the version if the data did change', () => {
      operations.setItem(key, 'curry')
      const { version } = operations.getItem(key)

      operations.setItem(key, 'toast')

      expect(operations.getItem(key).version).to.equal(version + 1)
    })

  })

  describe('#getItem(key)', () => {

    it('should return a falsy store object for a key that does not exist', () => {
      expect(operations.getItem('lemons')).to.deep.equal({ data: undefined, version: 0 })
    })

  })

})
