import React from 'react'
import SearchResultsTable from 'common/search/SearchResultsTable'
import {mount} from 'enzyme'

describe('SearchResultsTable', () => {
  const renderSearchResultsTable = ({results = [], ...args} = {}) => {
    const props = {results, ...args}
    return mount(<SearchResultsTable {...props} />, {disableLifecycleMethods: true})
  }

  let component
  const defaultMockedResults = [
    {
      'gender': 'female',
      'address': {
        'city': 'Lake Elsinore',
        'state': 'CA',
        'zip': '92530',
        'streetAddress': '4451 Anniversary Parkway',
        'type': 'Home',
      },
      'phoneNumber': {
        'number': '(923) 000-9928',
        'type': 'Home',
      },
      'dateOfBirth': '2005-01-03',
      'fullName': 'Sarah Timson',
    },
    {
      'gender': 'female',
      'clientCounties': [
        'Los Angeles',
      ],
      'address': null,
      'phoneNumber': null,
      'dateOfBirth': '1994-10-01',
      'fullName': 'c2 Bimson',
    },
    {
      'gender': 'unknown',
      'address': {
        'city': 'King City',
        'state': 'CA',
        'zip': '95662',
        'streetAddress': '456 Anhalt Terrace',
        'type': 'Home',
      },
      'phoneNumber': {
        'number': '(923) 000-9928',
        'type': 'Home',
      },
      'dateOfBirth': '1999-02-17',
      'fullName': 'Sally Mae Dibson',
    },
    {
      'gender': 'male',
      'address': null,
      'phoneNumber': null,
      'dateOfBirth': '1994-05-14',
      'fullName': 'Simon Donativo',
    },
    {
      'gender': 'male',
      'address': {
        'city': 'town',
        'state': 'CA',
        'zip': null,
        'streetAddress': '123 4th',
        'type': 'Placement Home',
      },
      'phoneNumber': null,
      'dateOfBirth': '1983-01-01',
      'fullName': 'First Gimson',
    },
  ]

  beforeEach(() => {
    component = renderSearchResultsTable({results: defaultMockedResults})
  })

  it('render table headers', () => {
    expect(component.find('div.rt-resizable-header-content')
      .at(0).text())
      .toEqual('Name')
    expect(component.find('div.rt-resizable-header-content')
      .at(1).text())
      .toEqual('Date of Birth')
    expect(component.find('div.rt-resizable-header-content')
      .at(2).text())
      .toEqual('Sex at Birth')
    expect(component.find('div.rt-resizable-header-content')
      .at(3).text())
      .toEqual('Service Provider County')
    expect(component.find('div.rt-resizable-header-content')
      .at(4).text())
      .toEqual('Service Provider Phone')
    expect(component.find('div.rt-resizable-header-content')
      .at(5).text())
      .toEqual('Address')
    expect(component.find('div.rt-resizable-header-content')
      .at(6).text())
      .toEqual('Case Status')
  })

  it('render table data', () => {
    expect(component.find('div.rt-tr-group')
      .at(0).find('div.rt-td')
      .at(0).text())
      .toEqual('1. Sarah Timson')
    expect(component.find('div.rt-tr-group')
      .at(0).find('div.rt-td')
      .at(1).text())
      .toEqual('2005-01-03')
    expect(component.find('div.rt-tr-group')
      .at(0).find('div.rt-td')
      .at(2).text())
      .toEqual('female')
    expect(component.find('div.rt-tr-group')
      .at(0).find('div.rt-td')
      .at(3).text())
      .toEqual('')
    expect(component.find('div.rt-tr-group')
      .at(0).find('div.rt-td')
      .at(4).text())
      .toEqual('')
    expect(component.find('div.rt-tr-group')
      .at(0).find('div.rt-td')
      .at(5).text())
      .toContain(
        '4451 Anniversary Parkway'
      )
    expect(component.find('div.rt-tr-group')
      .at(0).find('div.rt-td')
      .at(6).text())
      .toEqual('')
  })
})
