import sinon from 'sinon'

import createStoreHandlers from '../../src/server/handlers'

let sandbox, fixtures, store

describe('handlers', function () {

  beforeEach(() => {
    fixtures = {}

    sandbox = sinon.createSandbox()

    store = {
      getItem: sandbox.stub(),
      setItem: sandbox.stub()
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#handlePrefetchItem', () => {
    let handlePrefetchItem

    beforeEach(() => {
      handlePrefetchItem = createStoreHandlers(store).handlePrefetchItem

      fixtures.req = { params: { key: 'toast' } }
      fixtures.res = { locals: {} }
      fixtures.next = sandbox.spy()
    })

    it('applies an existing store item to res.locals', () => {
      const { req, res, next } = fixtures

      const expected = { data: 'sandwich', version: 1 }

      store.getItem.withArgs('toast').returns(expected)

      handlePrefetchItem(req, res, next)

      expect(res.locals).to.have.own.property('item')
      expect(res.locals.item).to.deep.equal(expected)
      expect(next).to.have.been.calledOnce
    })

    it('applies an undefined store item to res.locals', () => {
      const { req, res, next } = fixtures

      const expected = { data: undefined, version: 0 }

      store.getItem.withArgs('toast').returns(expected)

      handlePrefetchItem(req, res, next)

      expect(res.locals).to.have.own.property('item')
      expect(res.locals.item).to.deep.equal(expected)
      expect(next).to.have.been.calledOnce
    })

  })

  describe('#handleGetItem', () => {
    let handleGetItem

    beforeEach(() => {
      handleGetItem = createStoreHandlers(store).handleGetItem

      fixtures.res = {
        locals: { item: {} },
        sendStatus: sandbox.stub().returnsThis(),
        end: sandbox.spy(),
        set: sandbox.spy(),
        send: sandbox.spy()
      }
    })

    it('sends 404 if the requested item does not exist', () => {
      const { res } = fixtures

      res.locals.item = { data: undefined, version: 0 }

      handleGetItem({}, res)

      expect(res.sendStatus).to.have.been.calledWith(404)
      expect(res.end).to.have.been.calledOnce
    })

    it('sends item data with the version as an ETag', () => {
      const { res } = fixtures

      const data = 'hats'
      const version = 23

      res.locals.item = { data, version }

      handleGetItem({}, res)

      expect(res.set).to.have.been.calledWith({ ETag: `W/"${version}"` })
      expect(res.send).to.have.been.calledWith(data)
      expect(res.end).to.have.been.calledOnce
    })
  })

  describe('#handlePutItem', () => {
    let handlePutItem

    beforeEach(() => {
      handlePutItem = createStoreHandlers(store).handlePutItem

      fixtures.req = {
        get: sandbox.stub(),
        params: {},
        body: {}
      }

      fixtures.res = {
        locals: { item: { data: 'hats', version: 23 } },
        sendStatus: sandbox.stub().returnsThis(),
        end: sandbox.spy(),
        set: sandbox.spy(),
        send: sandbox.spy()
      }
    })

    it('sends 412 if the request to update did not include the matching ETag value', () => {
      const { req, res } = fixtures

      req.get.withArgs('if-match').returns('W/"1"')

      handlePutItem(req, res)

      expect(res.sendStatus).to.have.been.calledWith(412)
      expect(res.end).to.have.been.calledOnce
    })

    it('sends 200 if the request to update includes the matching ETag value', () => {
      const { req, res } = fixtures

      const key = 'foo'
      const value = 'toast'

      req.params.key = key
      req.body.value = value

      req.get.withArgs('if-match').returns('W/"23"')

      handlePutItem(req, res)

      expect(store.setItem).to.have.been.calledWith(key, value)
      expect(res.sendStatus).to.have.been.calledWith(200)
      expect(res.end).to.have.been.calledOnce
    })
  })

})
