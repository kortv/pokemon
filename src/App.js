import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import get from 'lodash.get'
import { Table } from 'antd'
import { getIdFromUrl } from './utils'
import * as actionCreators from './actions'
import {images} from './constants'
import Filters from './Filters'
import './index.css'

const isImage = (id) => id && new RegExp(`,${id},`).test(images)
const columns = [
  {
    title: 'Avatar',
    dataIndex: 'id',
    render: (id) => (<img src={`img/${isImage(id) ? id : 0}.png`} alt=""/> : null),
    key: 'avatar',
    width: '10%'
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => {
      if (a.name > b.name) {
        return 1
      }
      if (a.name < b.name) {
        return -1
      }
      return 0
    }
  },
  {
    title: 'Types',
    dataIndex: 'types',
    render: types => {
      return types ? types.map(obj => get(obj, 'type.name')).join(', ') : null
    },
    key: 'types'
  },
  {
    title: 'Abilities',
    dataIndex: 'abilities',
    render: abilities => {
      return abilities
        ? abilities.map(obj => get(obj, 'ability.name')).join(', ')
        : null
    },
    key: 'abilities'
  }
]

const locale = {
  filterTitle: 'filter',
  filterConfirm: 'OK',
  filterReset: 'Reset',
  emptyText: 'nothing found'
}

class MainTable extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      pageSize: 5
    }
  }

  componentDidMount () {
    this.props.actions.fetchPokemons()
  }

  _renderFilters = (data) => {
    const {props} = this
    if (!props.isFetching && data.length) {
      const filtred = data.filter(obj => {
        const id = getIdFromUrl(obj.url)
        return id && !props.details[id]
      })
      filtred.length && props.actions.fetchPokemon(filtred)
    }
    return <Filters
      {...this.state}
      {...props}
      onSearch={this._onSearch}
      onSelect={this._onSelect}
      onChange={this._onChange}
    />
  };

  _onSearch = () => {
    this.props.actions.setFilteredData(this.props)
  };

  _onSelect = (url) => {
    const id = getIdFromUrl(url)
    if (id) {
      !this.props.typeDetails[id]
        ? this.props.actions.fetchType(url)
        : this.props.actions.setType(id)
    }
  };

  _onChange = pageSize => {
    this.setState({
      pageSize
    })
  };

  render () {
    const { props } = this
    return (
      <div className='main'>
        <Table
          className='table'
          columns={columns}
          dataSource={props.isFilter ? props.filteredList : props.dataList}
          locale={locale}
          title={this._renderFilters}
          loading={props.isFetching}
          pagination={this.state}
        />
      </div>
    )
  }
}

MainTable.defaultProps = {
  dataList: [],
  typeList: [],
  actions: {},
  details: {}
}

const mapStateToProps = function (store) {
  return store.pokemons
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MainTable)
