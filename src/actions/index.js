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
  SET_TYPE,
  SET_FILTER,
  FILTER_DATA
} from '../constants'

// function megrgeData (payload) {
//   return {
//     type: MEGRGE_DATA,
//     payload
//   }
// }

export function setFilteredData ({ searchText, dataList }) {
  const reg = new RegExp(searchText, 'gi')
  dataList.filter(record => !!record.name.match(reg))

  return (dispatch) => dispatch({
    type: FILTER_DATA,
    payload: dataList.filter(record => !!record.name.match(reg))
  })
}

export function setFilter (e) {
  return (dispatch) => dispatch({
    type: SET_FILTER,
    payload: e.target.value
  })
}

function pokemonsPending () {
  return {
    type: POKEMONS_PENDING
  }
}

function pokemonsFulfilled (payload) {
  return {
    type: POKEMONS_FULFILLED,
    payload
  }
}

function pokemonsRejected (payload) {
  return {
    type: POKEMONS_REJECTED,
    payload
  }
}

export function fetchPokemons () {
  return (dispatch) => {
    dispatch(pokemonsPending())
    return (
      Promise.all([
        fetch('http://pokeapi.co/api/v2/pokemon/?limit=999')
        .then((response) => response.json()),
        fetch('http://pokeapi.co/api/v2/type/?limit=999')
        .then((response) => response.json())
      ])
        .then((data) => dispatch(pokemonsFulfilled(data)))
        .catch((error) => dispatch(pokemonsRejected(error)))
    )
  }
}

function pokemonPending () {
  return {
    type: POKEMON_PENDING
  }
}

function pokemonFulfilled (data) {
  console.log(data)
  return {
    type: POKEMON_FULFILLED,
    payload: data.reduce((obj, val) => ({
      ...obj,
      [val.id]: val
    }), {}),
    data
  }
}

function pokemonRejected (payload) {
  return {
    type: POKEMON_REJECTED,
    payload
  }
}

export function fetchPokemon (data) {
  return (dispatch) => {
    dispatch(pokemonPending())
    return (
      Promise.all(data.map(({url}) => {
        console.log(url)
        return fetch(url)
        .then((response) => response.json())
      }))
      .then((data) => {
        // dispatch(megrgeData(data))
        dispatch(pokemonFulfilled(data))
      })
      .catch((error) => dispatch(pokemonRejected(error)))
    )
  }
}

function typePending (payload) {
  return {
    type: TYPE_PENDING,
    payload
  }
}

export function setType (payload) {
  return {
    type: SET_TYPE,
    payload
  }
}

function typeFulfilled ({id, pokemon}) {
  console.log(id, pokemon)
  return {
    type: TYPE_FULFILLED,
    id,
    payload: pokemon
  }
}

function typeRejected (payload) {
  return {
    type: TYPE_REJECTED,
    payload
  }
}

export function fetchType (url) {
  console.log(url)
  return (dispatch) => {
    dispatch(typePending(url))
    return (
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          dispatch(typeFulfilled(data))
          // dispatch(megrgeData(data))
        })
        .catch((error) => dispatch(typeRejected(error)))
    )
  }
}
