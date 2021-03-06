import {List, Map} from 'immutable'
import {
  selectCounties,
  systemCodeDisplayValue,
} from 'selectors/systemCodeSelectors'
import {
  mapLanguages,
  mapIsSensitive,
  mapIsSealed,
  mapIsProbationYouth,
  mapRaces,
  mapEthnicities,
  mapAddress,
  mapPhoneNumber,
} from 'utils/peopleSearchHelper'
import {isCommaSuffix, formatHighlightedSuffix} from 'utils/nameFormatter'
import {phoneNumberFormatter} from 'utils/phoneNumberFormatter'
import Fuse from 'fuse.js'
import {getClientIdErrors} from 'utils/clientIdValidator'
import {getSSNErrors} from 'utils/ssnValidator'
import {isFutureDatetimeCreate, combineCompact} from 'utils/validator'

const LAST_NAME_MIN_SEARCHABLE_CHARS = 1
const CLIENT_ID_MIN_SEARCHABLE_CHARS = 19
const SSN_MIN_SEARCHABLE_CHARS = 9

const selectPeopleSearch = state => {
  return state.get('peopleSearch')
}
export const selectSearchTermValue = state =>
  selectPeopleSearch(state).get('searchTerm')
export const selectResultsTotalValue = state =>
  selectPeopleSearch(state).get('total')
export const selectLastResultsSortValue = state => {
  const lastResult = selectPeopleSearch(state)
    .get('results')
    .last()
  return lastResult.get('sort').toJS()
}

const formatSSN = ssn => ssn && ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3')
const formatDOB = (dob, highlight) =>
  highlight ? '<em>'.concat(dob, '</em>') : dob
const formatPhoneNumber = phoneNumber =>
  phoneNumber ?
    Map({
      number: phoneNumberFormatter(phoneNumber.get('number')),
      type: phoneNumber.get('type'),
    }) :
    null

// Try to find a match from a list of highlights by stripping out <em> tags
const highlightNameField = (exactName, highlights) =>
  highlights.find(
    highlight => highlight.replace(/<(\/)?em>/g, '') === exactName
  )

const maybeHighlightedField = (result, highlight, key) =>
  highlight.getIn(
    [key, 0],
    highlightNameField(
      result.get(key),
      highlight.get('autocomplete_search_bar', List())
    )
  )

const combineFullName = (
  firstName,
  middleName,
  lastName,
  nameSuffix,
  isCommaSuffix
) => {
  const nameStem = [firstName, middleName, lastName].filter(Boolean).join(' ')

  if (nameSuffix) {
    return `${nameStem}${isCommaSuffix ? ',' : ''} ${nameSuffix}`
  }

  return nameStem
}

const formatFullName = (result, highlight) =>
  combineFullName(
    maybeHighlightedField(result, highlight, 'first_name') ||
    result.get('first_name'),
    maybeHighlightedField(result, highlight, 'middle_name') ||
    result.get('middle_name'),
    maybeHighlightedField(result, highlight, 'last_name') ||
    result.get('last_name'),
    formatHighlightedSuffix(
      maybeHighlightedField(result, highlight, 'name_suffix') ||
      result.get('name_suffix')
    ),
    isCommaSuffix(result.get('name_suffix'))
  )

const mapCounties = (counties, countyCodes) =>
  counties.map(county => systemCodeDisplayValue(county.get('id'), countyCodes))

const hasActiveCsec = _result => false

export const selectAkaFullName = (state, result) => {
  const akas = result.get('akas', List()).toJS()
  const searchTerm = selectSearchTermValue(state)
  const options = {
    threshold: 0.7,
    keys: ['first_name', 'last_name', 'middle_name'],
  }
  const fuse = new Fuse(akas, options)
  const aka = fuse.search(searchTerm)[0]
  if (!aka) {
    return null
  }
  return ` (${aka.name_type || ''}: ${aka.first_name || ''} ${aka.last_name ||
    ''})`
}

export const selectPeopleResults = (state) => selectPeopleSearch(state)
  .get('results')
  .map((fullResult) => {
    const result = fullResult.get('_source', Map())
    const highlight = fullResult.get('highlight', Map())
    return Map({
      akaFullName: selectAkaFullName(state, result),
      legacy_id: result.get('id'),
      fullName: formatFullName(result, highlight),
      legacyDescriptor: result.get('legacy_descriptor'),
      gender: result.get('gender'),
      languages: mapLanguages(state, result),
      races: mapRaces(state, result),
      ethnicity: mapEthnicities(state, result),
      dateOfBirth: formatDOB(result.get('date_of_birth'), highlight.has('searchable_date_of_birth')),
      isDeceased: Boolean(result.get('date_of_death')),
      isCsec: hasActiveCsec(result),
      ssn: formatSSN(maybeHighlightedField(result, highlight, 'ssn') || result.get('ssn')),
      clientCounties: mapCounties(result.get('client_counties', List()), selectCounties(state)),
      address: mapAddress(state, result),
      phoneNumber: formatPhoneNumber(mapPhoneNumber(result).first()),
      isSensitive: mapIsSensitive(result),
      isSealed: mapIsSealed(result),
      isProbationYouth: mapIsProbationYouth(result),
    })
  })

export const selectStartTime = state =>
  selectPeopleSearch(state).get('startTime')

export const selectPersonCreatedAtTime = state =>
  state
    .get('relationshipsQueryCycleTime')
    .toJS()
    .map(t => t.personCreatedAtTime)
    .pop()

export const selectClientIdErrors = (state) => {
  const checkForClientIdErrors = selectPeopleSearch(state).get('clientIdErrorCheck')
  const clientId = selectPeopleSearch(state).get('searchClientId') || ''
  const clientIdWithoutHyphens = clientId.replace(/-|_/g, '')
  return checkForClientIdErrors ? getClientIdErrors(clientIdWithoutHyphens) : []
}

export const selectSsnErrors = (state) => {
  const checkForSsnErrors = selectPeopleSearch(state).get('ssnErrorCheck')
  const ssn = selectPeopleSearch(state).get('searchSsn')
  const ssnWithoutHyphens = ssn.replace(/-|_/g, '')
  return checkForSsnErrors ? getSSNErrors(ssnWithoutHyphens) : []
}

export const selectDobErrors = (state) => {
  const dob = selectPeopleSearch(state).get('searchDateOfBirth') || ''
  return combineCompact(isFutureDatetimeCreate(dob, 'Please enter date as today or earlier.'))
}

export const selectPersonSearchFields = state => {
  const personSearchFields = {
    searchTerm: selectPeopleSearch(state).get('searchTerm'),
    searchLastName: selectPeopleSearch(state).get('searchLastName'),
    searchFirstName: selectPeopleSearch(state).get('searchFirstName'),
    searchMiddleName: selectPeopleSearch(state).get('searchMiddleName'),
    searchClientId: selectPeopleSearch(state).get('searchClientId'),
    searchSuffix: selectPeopleSearch(state).get('searchSuffix'),
    searchSsn: selectPeopleSearch(state).get('searchSsn'),
    searchDateOfBirth: selectPeopleSearch(state).get('searchDateOfBirth'),
    searchApproximateAge: selectPeopleSearch(state).get('searchApproximateAge'),
    searchApproximateAgeUnits: selectPeopleSearch(state).get(
      'searchApproximateAgeUnits'
    ),
    searchByAgeMethod: selectPeopleSearch(state).get('searchByAgeMethod'),
    searchSexAtBirth: selectPeopleSearch(state).get('searchSexAtBirth'),
    searchAddress: selectPeopleSearch(state).get('searchAddress'),
    searchCity: selectPeopleSearch(state).get('searchCity'),
    searchCounty: selectPeopleSearch(state).get('searchCounty'),
    searchState: selectPeopleSearch(state).get('searchState'),
    searchCountry: selectPeopleSearch(state).get('searchCountry'),
    searchZipCode: selectPeopleSearch(state).get('searchZipCode'),
  }
  return personSearchFields
}

const isSearchable = (value, min) => {
  if (min === LAST_NAME_MIN_SEARCHABLE_CHARS) {
    return value && value.length >= min
  }
  return value && value.replace(/-|_/g, '').length === min
}

let emptyCheckForLastName
let emptyCheckForClientId
let emptyCheckForSsn
let emptyCheckForFields = true

const isEmptyCheckForLastName = (searchableLastName) => {
  if (searchableLastName === '') {
    emptyCheckForLastName = true
  } else {
    emptyCheckForLastName = false
  }
}
const isEmptyCheckForClientId = (searchableClientId) => {
  if (searchableClientId === '') {
    emptyCheckForClientId = true
  } else {
    emptyCheckForClientId = false
  }
}
const isEmptyCheckForSsn = (searchableSsn) => {
  if (searchableSsn === '') {
    emptyCheckForSsn = true
  } else {
    emptyCheckForSsn = false
  }
}
const isEmptyCheckForFields = (searchLastName, searchClientId, searchSsn, searchDateOfBirth) => {
  if (searchLastName === '' && searchClientId === '' && searchSsn === '' && searchDateOfBirth === '') {
    emptyCheckForFields = false
  } else {
    emptyCheckForFields = true
  }
}
const canSearchable = (searchableLastName, searchableClientId, searchableSsn, dobErrors, ssnErrors) => {
  const isSearchableLastName = emptyCheckForLastName || searchableLastName
  const isSearchableClientId = emptyCheckForClientId || searchableClientId
  const isSearchableSsn = emptyCheckForSsn || searchableSsn
  const isSearchableDobErrors = dobErrors.length === 0
  const isSearchableSsnErrors = ssnErrors.length === 0
  const isSearchable = emptyCheckForFields && isSearchableLastName &&
    isSearchableClientId && isSearchableSsn && isSearchableDobErrors &&
    isSearchableSsnErrors
  return isSearchable
}

export const selectCanSearch = (state) => {
  const {searchLastName, searchClientId, searchSsn, searchDateOfBirth} = selectPersonSearchFields(state)
  const searchableLastName = isSearchable(searchLastName, LAST_NAME_MIN_SEARCHABLE_CHARS)
  const searchableClientId = isSearchable(searchClientId, CLIENT_ID_MIN_SEARCHABLE_CHARS)
  const searchableSsn = isSearchable(searchSsn, SSN_MIN_SEARCHABLE_CHARS)
  const dobErrors = selectDobErrors(state)
  const ssnErrors = selectSsnErrors(state)
  isEmptyCheckForFields(searchLastName, searchClientId, searchSsn, searchDateOfBirth)
  isEmptyCheckForLastName(searchableLastName)
  isEmptyCheckForClientId(searchableClientId)
  isEmptyCheckForSsn(searchableSsn)
  return canSearchable(searchableLastName, searchableClientId, searchableSsn, dobErrors, ssnErrors)
}
