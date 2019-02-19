import React from 'react'
import PropTypes from 'prop-types'
import {PersonSearchFieldsPropType} from 'data/personSearch'

const MIN_SEARCHABLE_CHARS = 2

const isSearchable = value =>
  value && value.replace(/^\s+/, '').length >= MIN_SEARCHABLE_CHARS

const canSearch = ({
  searchLastName,
  searchFirstName,
  searchMiddleName,
  searchSsn,
  searchDateOfBirth,
  searchAddress,
}) => {
  const fields = [
    searchLastName,
    searchFirstName,
    searchMiddleName,
    searchSsn,
    searchDateOfBirth,
    searchAddress,
  ]
  const searchableFields = fields.filter(field => isSearchable(field))
  return Boolean(searchableFields.length)
}

const PersonSearchButtonGroup = ({
  onSubmit,
  onCancel,
  personSearchFields,
}) => (
  <div className="row person-search-field-group">
    <div className="col-md-12">
      <button
        className="btn btn-primary person-search-button search"
        onClick={onSubmit}
        disabled={!canSearch(personSearchFields)}
      >
        Search
      </button>
      <button
        className="btn btn-primary person-search-button cancel"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  </div>
)

PersonSearchButtonGroup.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  personSearchFields: PersonSearchFieldsPropType,
}

export default PersonSearchButtonGroup
