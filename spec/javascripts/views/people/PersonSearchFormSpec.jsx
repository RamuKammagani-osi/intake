import React from 'react'
import {shallow} from 'enzyme'
import {PersonSearchForm} from 'views/people/PersonSearchForm'
import * as IntakeConfig from 'common/config'
import {ModalComponent} from 'common/Modal'
import SearchModalBody from 'common/search/SearchModalBody'

describe('PersonSearchForm', () => {
  beforeEach(() => {
    spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(true)
    spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
  })

  function renderPersonSearchForm({
    canCreateNewPerson = false,
    onBlur = () => null,
    onChange = () => null,
    onClear = () => null,
    onCancel = () => null,
    onSelect = () => null,
    onLoadMoreResults = () => null,
    onSearch = () => null,
    counties = [],
    states = [],
    searchPrompt = '',
    ...args
  }) {
    const props = {
      canCreateNewPerson,
      onBlur,
      onChange,
      onClear,
      onCancel,
      onSelect,
      onLoadMoreResults,
      onSearch,
      counties,
      states,
      searchPrompt,
      ...args,
    }
    return shallow(<PersonSearchForm {...props} />, {
      disableLifecycleMethods: true,
    })
  }

  it('componentWillUnmount', () => {
    const onCancel = jasmine.createSpy('onCancel')
    const component = renderPersonSearchForm({onCancel})
    component.unmount()
    expect(onCancel).toHaveBeenCalled()
  })

  it('renders a card anchor', () => {
    const component = renderPersonSearchForm({})
    expect(component.find('.anchor').exists()).toBe(true)
    expect(component.find('.anchor').props()['aria-label']).toEqual(
      'search-card-anchor'
    )
  })

  it('renders the autocompleter', () => {
    const component = renderPersonSearchForm({})
    const autocompleter = component.find('Autocompleter')
    expect(autocompleter.exists()).toEqual(true)
    expect(autocompleter.props().id).toEqual('screening_participants')
  })

  it('passes props to the autocompleter', () => {
    const isSelectable = jasmine.createSpy('isSelectable')
    const onSelect = jasmine.createSpy('onSelect')
    const component = renderPersonSearchForm({
      isSelectable,
      onSelect,
      personSearchFields: {searchCounty: 'Orange'},
    })
    const autocompleter = component.find('Autocompleter')
    expect(autocompleter.props().isSelectable).toEqual(isSelectable)
    expect(autocompleter.props().onSelect).toEqual(onSelect)
    expect(autocompleter.props().personSearchFields.searchCounty).toEqual('Orange')
    expect(autocompleter.props().counties).toEqual([])
    expect(autocompleter.props().states).toEqual([])
  })

  it('renders the card header', () => {
    const component = renderPersonSearchForm({})
    expect(
      component
        .find('.card-header')
        .children('h2')
        .text()
    ).toEqual('Snapshot Search')
  })

  it("renders 'How to Use Snapshot' link", () => {
    spyOn(IntakeConfig, 'isAdvancedSearchOn').and.returnValue(true)
    const component = renderPersonSearchForm({})
    expect(
      component
        .find('.card-header')
        .children('span')
        .text()
    ).toEqual('How to Use Snapshot')
    expect(component.find('.card-header').children('span').props().className).toEqual('gap-right search-modal-info')
  })

  it("doesnot renders 'How to Use Snapshot' link in screening", () => {
    spyOn(IntakeConfig, 'isAdvancedSearchOn').and.returnValue(false)
    const component = renderPersonSearchForm({})
    expect(component.find('.search-modal-info').children('span').exists()).toBe(false)
  })

  it("renders the modal when 'How to Use Snapshot' link is clicked", () => {
    const instance = renderPersonSearchForm({}).instance()
    expect(instance.state.show).toBe(false)
    instance.handleShowModal()
    expect(instance.state.show).toBe(true)
  })

  it('hides the model when OK button is clicked', () => {
    const instance = renderPersonSearchForm({}).instance()
    instance.setState({show: true})
    expect(instance.state.show).toBe(true)
    instance.closeModal()
    expect(instance.state.show).toBe(false)
  })

  fit('renders ModalComponent', () => {
    const component = renderPersonSearchForm({}).setState({show: true}).find(ModalComponent)
    console.log('component', component.debug())
    expect(component.length).toBe(1)
    expect(component.props().modalTitle).toEqual('How to Use Snapshot')
    expect(component.props().modalSize).toEqual('large')
    expect(component.props().showModal).toEqual(true)
    expect(component.props().modalBody).toEqual(<SearchModalBody />)
  })

  it('renders the search prompt', () => {
    const component = renderPersonSearchForm({searchPrompt: 'Search for any person'})
    const label = component.find('label.pull-left')
    expect(label.text()).toContain('Search for any person')
  })

  it('adds a class when address search is enabled', () => {
    spyOn(IntakeConfig, 'isAdvancedSearchOn').and.returnValue(true)
    const component = renderPersonSearchForm({})
    expect(component.find('.advanced-search-enabled').exists()).toEqual(true)
  })

  it('adds a class when address search is disabled', () => {
    spyOn(IntakeConfig, 'isAdvancedSearchOn').and.returnValue(false)
    const component = renderPersonSearchForm({})
    expect(component.find('.advanced-search-disabled').exists()).toEqual(true)
  })
})
