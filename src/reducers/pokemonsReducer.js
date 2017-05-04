import {
  POKEMONS_PENDING,
  POKEMONS_FULFILLED,
  POKEMONS_REJECTED,
  POKEMON_PENDING,
  POKEMON_FULFILLED,
  POKEMON_REJECTED,
  TYPE_PENDING,
  TYPE_FULFILLED,
  TYPE_REJECTED,
  MEGRGE_DATA,
  SET_FILTER,
  SET_TYPE,
  FILTER_DATA
} from '../constants'
import {getIdFromUrl} from '../utils'

const initialState = {
  dataList: [],
  filteredList: [],
  typeList: [],
  typeDetails: {},
  isFilter: false
  // screens: [],
  // currentScreen: {
  //   screen: 'Img'
  // }
}

const pokemonsReducer = (state = initialState, action) => {
  const mergeData = (obj) => {
    console.log(obj)
    const {pokemon = {}} = obj
    return obj.id ? obj : {
      ...pokemon,
      ...state.details[getIdFromUrl(pokemon.url || obj.url)]
    }
  }
  switch (action.type) {
    case SET_FILTER:
      return {
        ...state,
        searchText: action.payload
      }

    case FILTER_DATA:
      return {
        ...state,
        filteredList: action.payload,
        isFilter: !!action.payload,
        typeValue: undefined
      }

    case POKEMONS_PENDING:
      return {
        ...state,
        isFetching: true
      }

    case POKEMONS_FULFILLED:
      return {
        ...state,
        dataList: action.payload[0].results,
        typeList: action.payload[1].results,
        isFetching: false,
        error: false,
        errorDetails: ''
      }

    case POKEMONS_REJECTED:
      return {
        ...state,
        isFetching: false,
        error: true,
        errorDetails: action.payload
      }

    case SET_TYPE:
      return {
        ...state,
        filteredList: state.typeDetails[action.payload].map(mergeData),
        typeValue: action.payload,
        searchText: '',
        isFilter: true
      }

    case TYPE_PENDING:
      return {
        ...state,
        isFetching: true,
        searchText: '',
        typeValue: action.payload
      }

    case TYPE_FULFILLED:
      const data = action.payload.map(mergeData)
      return {
        ...state,
        typeDetails: {
          ...state.typeDetails,
          [action.id]: data
        },
        filteredList: data,
        isFilter: true,
        isFetching: false,
        error: false,
        errorDetails: ''
      }

    case TYPE_REJECTED:
      return {
        ...state,
        isFetching: false,
        error: true,
        errorDetails: action.payload
      }

    case POKEMON_PENDING:
      return {
        ...state,
        isFetching: true
      }

    case POKEMON_FULFILLED:
      const newList = [...state.dataList]
      const newFilteredList = [...state.filteredList]
      action.data.forEach((data) => {
        const dataIndex = newList.findIndex((obj) => obj.name === data.name)
        const filtredIndex = newFilteredList.findIndex((obj) => obj.name === data.name)
        if (dataIndex >= 0) newList[dataIndex] = data
        if (filtredIndex >= 0) newFilteredList[filtredIndex] = data
      })
      return {
        ...state,
        details: {
          ...state.details,
          ...action.payload
        },
        dataList: newList,
        filteredList: newFilteredList,
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

    case MEGRGE_DATA: {
      const newList = [...state.dataList]
      const newFilteredList = [...state.filteredList]
      action.payload.forEach((data) => {
        const dataIndex = newList.findIndex((obj) => obj.name === data.name)
        const filtredIndex = newFilteredList.findIndex((obj) => obj.name === data.name)
        if (dataIndex >= 0) newList[dataIndex] = data
        if (filtredIndex >= 0) newFilteredList[filtredIndex] = data
      })
      return {
        ...state,
        dataList: newList,
        filteredList: newFilteredList
      }
    }

    default:
      return state
  }
}

export default pokemonsReducer
