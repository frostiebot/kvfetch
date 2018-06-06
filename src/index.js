import createStore from './store'
import createApp from './server'

import operations from './operations'

const store = createStore(operations)
const server = createApp(store)

server.listen(4000)
