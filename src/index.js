import createStoreServer from './server'
import store from './store'

const server = createStoreServer(store)

server.listen(4000)
