import React from 'react'
import PropTypes from 'prop-types'
import CardView from 'views/CardView'
import {SHOW_MODE} from 'actions/screeningPageActions'
import SearchResultsTable from 'common/search/SearchResultsTable'

const PersonSearchResults = ({results, total}) => {
  const title = `Search Results (${total || '0'} records found)`
  return (
    <CardView
      id="person-search-results"
      title={title}
      mode={SHOW_MODE}
      show={<SearchResultsTable results={results}/>}
    />
  )
}

PersonSearchResults.propTypes = {
  results: PropTypes.array,
  total: PropTypes.number,
}

export default PersonSearchResults
