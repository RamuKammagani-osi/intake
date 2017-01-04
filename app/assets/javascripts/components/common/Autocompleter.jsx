import * as Utils from 'utils/http'
import PersonSuggestion from 'components/common/PersonSuggestion'
import React from 'react'
import ReactAutosuggest from 'react-autosuggest'

export default class Autocompleter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      suggestions: [],
      isLoading: false,
    }
  }

  loadSuggestions(value) {
    this.setState({isLoading: true})
    Utils.request('GET', '/people/search', {search_term: value})
      .then((result) =>
        this.setState({
          isLoading: false,
          suggestions: result,
        })
      )
  }

  onChange(event, {newValue}) {
    this.setState({value: newValue})
  }

  onSuggestionsFetchRequested({value}) {
    this.loadSuggestions(value)
  }

  onSuggestionSelected(event, {suggestion}) {
    this.onSuggestionsClearRequested()
    this.setState({value: ''})
    this.props.onSelect(suggestion)
  }

  onSuggestionsClearRequested() {
    this.setState({suggestions: []})
  }

  getSuggestionValue(suggestion) {
    return `${suggestion.first_name} ${suggestion.last_name}`
  }

  renderSuggestion(suggestion) {
    const {first_name, last_name, gender, date_of_birth, ssn, addresses} = suggestion
    const first = 0
    const address = addresses[first]
    const addressInfo = {
      city: address.city,
      state: address.state,
      streetAddress: address.street_address,
      type: address.type,
      zip: address.zip,
    }
    return (
      <PersonSuggestion
        firstName={first_name}
        lastName={last_name}
        gender={gender}
        dateOfBirth={date_of_birth}
        ssn={ssn}
        address={addressInfo}
      />
    )
  }

  renderSuggestionsContainer(properties) {
    const children = properties.children
    return (
      <div {...properties}>
        {children}
      </div>
    )
  }

  render() {
    const {value, suggestions} = this.state
    const inputProps = {
      placeholder: 'Search people...',
      id: this.props.id,
      value,
      onChange: this.onChange.bind(this),
    }
    return (
      <ReactAutosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
        onSuggestionSelected={this.onSuggestionSelected.bind(this)}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion.bind(this)}
        inputProps={inputProps}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
      />
    )
  }
}

Autocompleter.propTypes = {
  id: React.PropTypes.string,
  onSelect: React.PropTypes.func,
}
Autocompleter.displayName = 'Autocompleter'
