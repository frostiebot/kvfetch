const http = require('http')

const createStore = require('./lib/store').default
const createApp = require('./lib/server').default

const operations = require('./lib/operations').default

const store = createStore(operations)
const app = createApp(store)

http.createServer(app).listen(80)

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
