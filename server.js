const http = require('http')

const store = require('./lib/store').default
const createStoreServer = require('./lib/server').default

const app = createStoreServer(store)
const server = http.createServer(app)

server.listen(80)

//eslint-disable-next-line
console.log('Server started on http://localhost:80... hit Ctrl+C to exit')

process.stdin.resume()

const exitHandler = (options, err) => {
  if (options.cleanup) store.persist()
  //eslint-disable-next-line
  if (err) console.log(err.stack)
  if (options.exit) process.exit()
}

process.on('exit', exitHandler.bind(null, { cleanup: true }))
process.on('SIGINT', exitHandler.bind(null, { exit: true }))
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))
process.on('uncaughtException', exitHandler.bind({ exit: true }))
