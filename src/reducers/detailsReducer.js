import {
  POKEMON_PENDING,
  POKEMON_FULFILLED,
  POKEMON_REJECTED
} from '../constants'

const initialState = {
  // screens: [],
  // currentScreen: {
  //   screen: 'Img'
  // }
}

const pokemonsReducer = (state = initialState, action) => {
  switch (action.type) {
    case POKEMON_PENDING:
      return {
        ...state,
        isFetching: true
      }

    case POKEMON_FULFILLED:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload
        },
        isFetching: false,
        error: false,
        errorDetails: ''
      }

    case POKEMON_REJECTED:
      return {
        ...state,
        isFetching: false,
        error: true,
        errorDetails: action.payload
      }

    default:
      return state
  }
}

export default pokemonsReducer
