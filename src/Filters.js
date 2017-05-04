import React from 'react'
import { Input, Icon, Select, InputNumber } from 'antd'
import './index.css'

const { Option } = Select
const Filters = (props) => (<div className='filter'>
  <div className='filter__unit'>
    <Input
      placeholder='Search pokemon by name'
      value={props.searchText}
      onChange={props.actions.setFilter}
      onPressEnter={props.onSearch}
      addonAfter={<Icon type='search' onClick={props.onSearch} className='search-icon' />}
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
      onSelect={props.onSelect}
      value={props.typeValue}
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
        value={props.pageSize}
        onChange={props.onChange}
      />
    </span>
  </div>
</div>)

export default Filters
