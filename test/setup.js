process.env.NODE_ENV = 'test'

const chai = require('chai')

chai.use(require('sinon-chai'))
chai.use(require('chai-http'))

global.chai = chai
