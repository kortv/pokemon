import { combineReducers } from 'redux'

// Reducers
import pokemonsReducer from './pokemonsReducer'
// import detailsReducer from './detailsReducer'

// Combine Reducers
const reducers = combineReducers({
  pokemons: pokemonsReducer
  // details: detailsReducer
})

export default reducers
