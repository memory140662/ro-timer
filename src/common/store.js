import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reduxPromise from 'redux-promise-middleware'
import reducer from '../common/reducers'

const middlewareList = [
    thunk,
    reduxPromise,
]

if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger')
  
    middlewareList.push(logger)
}

export default createStore(
    reducer,
    applyMiddleware(...middlewareList)
)