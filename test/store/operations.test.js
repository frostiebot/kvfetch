import createOperations from '../../src/store/operations'
import { default as _operations } from '../../src/operations'

let operations

const UNDEFINED_ITEM = { data: undefined, version: 0 }

describe('operations', () => {

  before(() => {
    operations = createOperations(_operations)
  })

  describe('#setItem(key, value)', () => {
    const key = 'lemon'

    beforeEach(() => {
      operations.setItem(key, 'curry')
    })

    afterEach(() => {
      operations.clear()
    })

    it('should set a new value into the store with a version of 1', () => {
      expect(operations.getItem(key)).to.deep.equal({ data: 'curry', version: 1 })
    })

    it('should not update an existing value in the store if the data did not change', () => {
      const existing = operations.getItem(key)

      operations.setItem(key, 'curry')

      expect(operations.getItem(key)).to.deep.equal(existing)
    })

    it('should update an existing value and increment the version if the data did change', () => {
      const { version } = operations.getItem(key)

      operations.setItem(key, 'toast')

      expect(operations.getItem(key).version).to.equal(version + 1)
    })

  })

  describe('#getItem(key)', () => {

    it('should return a falsy store object for a key that does not exist', () => {
      expect(operations.getItem('negative')).to.deep.equal(UNDEFINED_ITEM)
    })

  })

  describe('#deleteItem', () => {

    it('should perform a delete operation idempotently', () => {
      expect(operations.getItem('nope')).to.deep.equal(UNDEFINED_ITEM)
      expect(operations.deleteItem('nope'))
    })

    it('should delete an item for a given key', () => {
      operations.setItem('marked for death', 'unsuspecting value')
      expect(operations.getItem('marked for death')).to.deep.equal({ data: 'unsuspecting value', version: 1 })

      operations.deleteItem('marked for death')
      expect(operations.getItem('marked for death')).to.deep.equal(UNDEFINED_ITEM)
    })

  })

  describe('#persist', () => {

    it('should call persist and basically not explode', () => {
      expect(operations.persist).to.not.throw()
    })

  })

})
