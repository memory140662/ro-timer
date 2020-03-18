import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import reduxPromise from 'redux-promise-middleware'
import reducer from '../reducer'

const middlewareList = [
    thunk,
    reduxPromise,
]

if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger')
  
    middlewareList.push(logger)
}

export default createStore(
    combineReducers(reducer),
    applyMiddleware(...middlewareList)
)