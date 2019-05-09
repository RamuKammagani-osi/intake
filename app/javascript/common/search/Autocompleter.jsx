import PersonSuggestion from 'common/PersonSuggestion'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Autocomplete from 'react-autocomplete'
import SuggestionHeader from 'common/SuggestionHeader'
import CreateUnknownPerson from 'screenings/CreateUnknownPerson'
import ShowMoreResults from 'common/ShowMoreResults'
import {logEvent} from 'utils/analytics'
import moment from 'moment'
import PersonSearchFields from 'common/search/PersonSearchFields'
import {PersonSearchFieldsPropType} from 'data/personSearch'

const MIN_SEARCHABLE_CHARS = 2
const addPosAndSetAttr = (results) => {
  const one = 1
  for (let len = results.length, i = 0; i < len; ++i) {
    results[i].posInSet = i + one
    results[i].setSize = len
  }
}
const itemClassName = (isHighlighted) => `search-item${isHighlighted ? ' highlighted-search-item' : ''}`

export default class Autocompleter extends Component {
  constructor(props) {
    super(props)
    this.state = {menuVisible: false}
    this.hideMenu = this.hideMenu.bind(this)
    this.onItemSelect = this.onItemSelect.bind(this)
    this.renderMenu = this.renderMenu.bind(this)
    this.onChangeInput = this.onChangeInput.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  searchAndFocus() {
    const {onChange, onSearch, isAdvancedSearchOn, personSearchFields} = this.props
    const {searchLastName, searchFirstName, searchMiddleName, searchClientId, searchSuffix, searchSsn,
      searchDateOfBirth, searchApproximateAge, searchApproximateAgeUnits, searchByAgeMethod} = personSearchFields
    const suffixWithComma = searchSuffix ? `, ${searchSuffix}` : ''
    const lastNameWithSuffix = `${searchLastName}${suffixWithComma}`
    let searchTermList = [searchFirstName, searchMiddleName, lastNameWithSuffix, searchClientId, searchSsn]
    if (searchByAgeMethod === 'dob') {
      searchTermList.push(searchDateOfBirth)
    } else if (searchByAgeMethod === 'approximate') {
      searchTermList = searchTermList.concat([searchApproximateAge, searchApproximateAgeUnits])
    }
    const searchTerm = searchTermList.filter(Boolean).join(' ').trim()
    onSearch(isAdvancedSearchOn, personSearchFields)
    onChange('searchTerm', searchTerm)
    this.setState({menuVisible: true})
    if (this.inputRef) { this.inputRef.focus() }
  }

  handleSubmit() {
    this.props.onClear('results')
    this.searchAndFocus()
  }

  isSearchable(value) {
    return value && value.replace(/^\s+/, '').length >= MIN_SEARCHABLE_CHARS
  }

  hideMenu() {
    if (this.inputRef) { this.inputRef.setAttribute('aria-activedescendant', '') }
    this.setState({menuVisible: false})
  }

  loadMoreResults() {
    const {onLoadMoreResults, isAdvancedSearchOn, personSearchFields} = this.props
    onLoadMoreResults(isAdvancedSearchOn, personSearchFields)
    this.element_ref.setIgnoreBlur(true)
    if (this.inputRef) { this.inputRef.focus() }
  }

  onSelect(item) {
    this.props.onCancel()
    this.props.onSelect(item)
    this.hideMenu()
  }

  onButtonSelect(item) {
    if (item.createNewPerson) {
      return this.onSelect({id: null})
    } else if (item.suggestionHeader) {
      return false
    } return this.loadMoreResults()
  }

  onItemSelect(_value, item) {
    const {isSelectable, staffId, startTime} = this.props
    if (!item.legacyDescriptor) {
      this.onButtonSelect(item)
      return
    } else if (!isSelectable(item)) {
      alert('You are not authorized to add this person.') // eslint-disable-line no-alert
      return
    }
    logEvent('searchResultClick', {
      searchIndex: this.props.results.indexOf(item),
      staffId,
      startTime: moment(startTime).valueOf(),
    })
    this.onSelect(item)
  }

  renderMenu(items, _searchTerm, _style) {
    const {isAdvancedSearchOn} = this.props
    const hideMenu = isAdvancedSearchOn ? 'none' : 'block'
    return (<div className="autocomplete-menu" style={{display: hideMenu}}>{items}</div>)
  }

  renderEachItem(item, id, isHighlighted) {
    const {total, results, personSearchFields} = this.props
    const {searchTerm} = personSearchFields
    const key = `${item.posInSet}-of-${item.setSize}`
    if (item.suggestionHeader) {
      return (<div id={id} key={key} aria-live='polite'>
        <SuggestionHeader
          currentNumberOfResults={results.length}
          total={total}
          searchTerm={searchTerm}
        />
      </div>)
    }
    return (
      <div id={id} key={key} className={itemClassName(isHighlighted)}><PersonSuggestion {...item} /></div>
    )
  }

  renderItemButtons(item, isHighlighted, id, key) {
    const {canCreateNewPerson, results, total} = this.props
    const canLoadMoreResults = results && total > results.length
    const buttonClassName = canLoadMoreResults && canCreateNewPerson ? ' col-md-6' : ''
    const className = itemClassName(isHighlighted) + buttonClassName
    const button = item.showMoreResults ? <ShowMoreResults /> : <CreateUnknownPerson />
    return (<div id={id} key={key} className={className}>{button}</div>)
  }

  renderItem(item, isHighlighted, _styles) {
    const key = `${item.posInSet}-of-${item.setSize}`
    const id = `search-result-${key}`
    if (isHighlighted && this.inputRef) {
      this.inputRef.setAttribute('aria-activedescendant', id)
    }
    if (item.showMoreResults || item.createNewPerson) {
      return this.renderItemButtons(item, isHighlighted, id, key)
    } return this.renderEachItem(item, id, isHighlighted)
  }

  onChangeInput(_, value) {
    const {onSearch, onChange, isAdvancedSearchOn} = this.props
    if (this.isSearchable(value) && !isAdvancedSearchOn) {
      onSearch(isAdvancedSearchOn, {searchTerm: value})
      this.setState({menuVisible: true})
    } else { this.hideMenu() }
    onChange('searchTerm', value)
  }

  renderInput(props) {
    const newProps = {
      ...props,
      ref: (el) => {
        this.inputRef = el
        props.ref(el)
      },
    }
    return <input {...newProps} />
  }

  prepareAutocomplete() {
    const {personSearchFields, id, results, canCreateNewPerson, total, isAdvancedSearchOn} = this.props
    const {searchTerm} = personSearchFields
    const showMoreResults = {showMoreResults: 'Show More Results', posInSet: 'show-more', setSize: 'the-same'}
    const createNewPerson = {createNewPerson: 'Create New Person', posInSet: 'create-new', setSize: 'the-same'}
    const suggestionHeader = [{suggestionHeader: 'suggestion Header'}]
    const canLoadMoreResults = results && total > results.length
    addPosAndSetAttr(results) // Sequentually numbering items
    const newResults = suggestionHeader.concat(results.concat(canLoadMoreResults ? showMoreResults : [], canCreateNewPerson ? createNewPerson : []))
    return {id, searchTerm, newResults, isAdvancedSearchOn}
  }

  renderAutocomplete() {
    const {id, searchTerm, newResults, isAdvancedSearchOn} = this.prepareAutocomplete()
    return (
      <Autocomplete
        ref={(el) => (this.element_ref = el)}
        getItemValue={(_) => searchTerm}
        inputProps={{id, className: 'autocomplete-search-bar', disabled: isAdvancedSearchOn}}
        items={newResults}
        onChange={this.onChangeInput}
        onSelect={this.onItemSelect}
        renderItem={this.renderItem}
        open={this.state.menuVisible}
        renderMenu={this.renderMenu}
        value={searchTerm}
        wrapperStyle={{display: 'block'}}
        renderInput={(props) => this.renderInput(props)}
      />
    )
  }

  isValidDate = (e) => moment(e.target.value, 'MM/DD/YYYY', true).isValid()

  renderPersonSearchFields() {
    const {states, counties, onChange, onCancel, onBlur, onFocus, personSearchFields, isAdvancedSearchOn, clientIdError, ssnErrors, dobErrors, canSearch} = this.props
    const searchWithEnter = (e) => {
      const enterKeyCode = 13
      if ((canSearch && e.charCode === enterKeyCode)) { this.handleSubmit() }
    }
    const validateAndSetDateOfBirth = (e) => { if (this.isValidDate(e)) { onChange('searchDateOfBirth', moment(e.target.value).format('YYYY-MM-DD')) } }
    return (
      <PersonSearchFields
        onBlur={onBlur}
        onChange={onChange}
        onCancel={onCancel}
        onSubmit={this.handleSubmit}
        personSearchFields={personSearchFields}
        states={states}
        counties={counties}
        isAdvancedSearchOn={isAdvancedSearchOn}
        clientIdError={clientIdError}
        ssnErrors={ssnErrors}
        dobErrors={dobErrors}
        canSearch={canSearch}
        onKeyPress={searchWithEnter}
        onKeyUp={validateAndSetDateOfBirth}
        onFocus={onFocus}
      />)
  }

  render() {
    return (<div>{this.renderAutocomplete()}{this.renderPersonSearchFields()}</div>)
  }
}

Autocompleter.propTypes = {
  canCreateNewPerson: PropTypes.bool,
  canSearch: PropTypes.bool,
  clientIdError: PropTypes.array,
  counties: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string,
    value: PropTypes.string,
  })),
  dobErrors: PropTypes.array,
  id: PropTypes.string,
  isAdvancedSearchOn: PropTypes.bool,
  isSelectable: PropTypes.func,
  onBlur: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onLoadMoreResults: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  personSearchFields: PersonSearchFieldsPropType,
  results: PropTypes.array,
  ssnErrors: PropTypes.array,
  staffId: PropTypes.string,
  startTime: PropTypes.string,
  states: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  total: PropTypes.number,
}

Autocompleter.defaultProps = {
  isSelectable: () => true,
}

Autocompleter.displayName = 'Autocompleter'
