import express, { urlencoded } from 'express'

/**
 * We don't test this module because it would be silly to test an
 * express Application object ourselves when express does it for
 * themselves.
 */

const app = express()

app.use(urlencoded({
  extended: false,
  parameterLimit: 1
}))

app.set('etag', false)

app.get('/', (req, res) => {
  res.send('[KVFetch]<br />Send a GET to /:key to retrieve the value for a key in the store.<br />Send a PUT to /:key to set or update the value of a key in the store.').end()
})

export default app
