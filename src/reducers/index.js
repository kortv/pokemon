import { combineReducers } from 'redux'

// Reducers
import pokemonsReducer from './pokemonsReducer'

// Combine Reducers
const reducers = combineReducers({
  pokemons: pokemonsReducer
})

export default reducers
