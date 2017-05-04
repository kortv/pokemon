import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducers from './reducers'

const createStoreWithMiddleware = compose(
  applyMiddleware(
    thunkMiddleware
  ),
  window.devToolsExtension
    ? window.devToolsExtension({
      actionsBlacklist: ['REDUX_STORAGE_LOAD', 'REDUX_STORAGE_SAVE']
    })
    : (f) => f
)(createStore)
const store = createStoreWithMiddleware(reducers, {})
export default store
