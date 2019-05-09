import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class SearchResultsTable extends Component {
  columns = [{
    id: 'name',
    Header: 'Name',
    Cell: (row) => {
      const personName = row.original.fullName
      return personName ?
        `${row.index + 1}. ${personName}` : ''
    },
  }, {
    Header: 'Date of Birth',
    accessor: 'dateOfBirth',
  }, {
    Header: 'Sex at Birth',
    accessor: 'gender',
  }, {
    Header: 'Service Provider County',
    accessor: null,
  }, {
    Header: 'Service Provider Phone',
    accessor: null,
  }, {
    id: 'address',
    Header: 'Address',
    accessor: results => {
      const personAddress = results.address
      return personAddress ?
        `${personAddress.streetAddress},
         ${personAddress.city},
         ${personAddress.state},
         ${personAddress.zip}` : ''
    },
  }, {
    Header: 'Case Status',
    accessor: null,
  }]
  render() {
    const {results} = this.props
    return (
      <ReactTable
        data={results}
        columns={this.columns}
        defaultPageSize={25}
        minRows={0}
      />
    )
  }
}

SearchResultsTable.propTypes = {
  results: PropTypes.array,
}

export default SearchResultsTable
