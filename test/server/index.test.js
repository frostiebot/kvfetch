import sinon from 'sinon'

import createStoreServer from '../../src/server'

let sandbox, store, app

describe('server', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox()

    store = {
      getItem: sandbox.stub(),
      setItem: sandbox.stub()
    }

    store.getItem.withArgs('foo').returns({ data: 'bar', version: 23 })
    store.getItem.withArgs('nope').returns({ data: undefined, version: 0 })

    app = createStoreServer(store)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('returns a plain HTML response when the root path is hit', () => {
    chai.request(app)
      .get('/')
      .then(res => {
        expect(res).to.have.status(200)
        expect(res).to.be.html
      })
  })

  it('returns 404 when hitting against /nope', () => {
    chai.request(app)
      .get('/nope')
      .catch(err => {
        expect(err).to.have.status(404)
      })
  })

  it('returns 200 when hitting against /foo', () => {
    const version = 23

    chai.request(app)
      .get('/foo')
      .then(res => {
        expect(res).to.have.status(200)
        expect(res).to.have.header('etag', `W/"${version}"`)
      })
  })

  it('returns 200 when updating against /foo with the correct version', () => {
    const version = 23

    chai.request(app)
      .put('/foo')
      .set('If-Match', `W/"${version}"`)
      .send({ value: 'biz' })
      .then(res => {
        expect(res).to.have.status(200)
        expect(res).to.not.have.header('etag')
      })
  })

  it('returns 412 when updating against /foo with the incorrect version', () => {
    const version = 1

    chai.request(app)
      .put('/foo')
      .set('If-Match', `W/"${version}"`)
      .send({ value: 'biz' })
      .then(res => {
        expect(res).to.have.status(412)
        expect(res).to.not.have.header('etag')
      })
  })

})
