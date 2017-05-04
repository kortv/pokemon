import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import get from 'lodash.get'
import { Table, Input, Icon, Select, InputNumber } from 'antd'
import { getIdFromUrl } from './utils'
import * as actionCreators from './actions'
import './index.css'

const { Option } = Select
const columns = [
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

  _getDetails = data => {
    if (!this.props.isFetching && data.length) {
      const filtred = data.filter(obj => {
        const id = getIdFromUrl(obj.url)
        return id && !this.props.details[id]
      })
      console.log(filtred)
      filtred.length && this.props.actions.fetchPokemon(filtred)
    }
  };

  _onSearch = () => {
    this.props.actions.setFilteredData(this.props)
  };

  _onSelect = url => {
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
        <div className='filter'>
          <div className='filter__unit'>
            <Input
              placeholder='Search pokemon by name'
              value={props.searchText}
              onChange={this.props.actions.setFilter}
              onPressEnter={this._onSearch}
              addonAfter={<Icon type='search' onClick={this._onSearch} className='search-icon' />}
            />
          </div>
          <div className='filter__unit'>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder='Select to filtered by type'
              optionFilterProp='children'
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0}
              onSelect={this._onSelect}
            >
              {props.typeList.map(obj => (
                <Option key={obj.name} value={obj.url}>{obj.name}</Option>
              ))}
            </Select>
          </div>
          <div className='filter__unit'>
            <span className='pagination-filter'>
              Pagination size:
              <InputNumber
                className='pagination__input'
                min={1}
                max={20}
                value={this.state.pageSize}
                onChange={this._onChange}
              />
            </span>
          </div>
        </div>
        <Table
          bordered
          className='table'
          columns={columns}
          dataSource={props.isFilter ? props.filteredList : props.dataList}
          locale={locale}
          footer={this._getDetails}
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
