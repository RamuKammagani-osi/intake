import React from 'react'
import {SnapshotPage, mapDispatchToProps} from 'snapshots/SnapshotPage'
import {clear, resetPersonSearch} from 'actions/peopleSearchActions'
import {shallow} from 'enzyme'

describe('SnapshotPage', () => {
  const renderSnapshotPage = ({participants = [], results = [], ...args}) => {
    const props = {participants, results, ...args}
    return shallow(<SnapshotPage {...props} />, {disableLifecycleMethods: true})
  }

  it('renders a BreadCrumb', () => {
    const snapshotPage = renderSnapshotPage({})
    expect(snapshotPage.find('Connect(BreadCrumb)').exists()).toBe(true)
  })

  it('renders a SnapshotIntro', () => {
    const snapshotPage = renderSnapshotPage({})
    expect(snapshotPage.find('SnapshotIntro').exists()).toEqual(true)
  })

  it('renders a PersonSearchResults', () => {
    const results = [{fullName: 'Sarah Timson'}]
    const snapshotPage = renderSnapshotPage({results: results})
    expect(snapshotPage.find('Connect(PersonSearchResults)').exists()).toEqual(true)
  })

  it('doesnot renders PersonSearchResults when no records found', () => {
    const snapshotPage = renderSnapshotPage({results: []})
    expect(snapshotPage.find('Connect(PersonSearchResults)').exists()).toBeFalsy()
  })

  it('renders history of involvement', () => {
    const snapshotPage = renderSnapshotPage({})
    expect(snapshotPage.find('Connect(HistoryOfInvolvement)').exists()).toBe(true)
  })

  it('renders person search', () => {
    const snapshotPage = renderSnapshotPage({})
    expect(snapshotPage.find('Connect(PersonSearchForm)').exists()).toBe(true)
    expect(snapshotPage.find('Connect(PersonSearchForm)').props().isClientOnly).toBe(true)
  })

  it('renders a person card for each participant', () => {
    const snapshotPage = renderSnapshotPage({participants: [{id: '3'}, {id: '5'}]})
    expect(snapshotPage.find('PersonCardView').length).toEqual(2)
  })

  it('passes the page title to the header', () => {
    const snapshotPage = renderSnapshotPage({})
    expect(snapshotPage.find('Connect(PageHeader)').exists()).toBe(true)
    expect(snapshotPage.find('Connect(PageHeader)').props().pageTitle).toEqual('Snapshot')
  })

  it('passes a null button to the page header so it does not render the default button', () => {
    const snapshotPage = renderSnapshotPage({})
    expect(snapshotPage.find('Connect(PageHeader)').props().button.type).toEqual('button')
  })

  it('calls the unmount function when the component is unmounted', () => {
    const unmount = jasmine.createSpy('unmount')
    const snapshotPage = renderSnapshotPage({unmount})
    snapshotPage.unmount()
    expect(unmount).toHaveBeenCalled()
  })

  describe('mapDispatchToProps', () => {
    describe('starting over', () => {
      it('clears search results', () => {
        const dispatch = jasmine.createSpy('dispatch')
        const props = mapDispatchToProps(dispatch)

        props.startOver()

        expect(dispatch).toHaveBeenCalledWith(clear('results'))
        expect(dispatch).toHaveBeenCalledWith(resetPersonSearch())
      })
    })
  })
})
