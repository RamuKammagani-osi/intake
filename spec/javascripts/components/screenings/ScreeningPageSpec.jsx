import {EDIT_MODE, SHOW_MODE} from 'actions/screeningPageActions'
import * as IntakeConfig from 'common/config'
import React from 'react'
import {ScreeningPage} from 'screenings/ScreeningPage'
import AllegationsCard from 'screenings/AllegationsCard'
import CrossReportCard from 'screenings/CrossReportCard'
import DecisionCard from 'screenings/DecisionCard'
import IncidentInformationCard from 'screenings/IncidentInformationCard'
import NarrativeCard from 'screenings/NarrativeCard'
import ScreeningInformationCard from 'screenings/ScreeningInformationCard'
import WorkerSafetyCard from 'screenings/WorkerSafetyCard'
import {shallow} from 'enzyme'

describe('ScreeningPage', () => {
  const sdmPath = 'https://ca.sdmdata.org'
  let isFeatureActiveSpy

  beforeEach(() => {
    spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(true)
    isFeatureActiveSpy = spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
    spyOn(IntakeConfig, 'sdmPath').and.returnValue(sdmPath)
  })

  function renderScreeningPage({
    actions = {},
    editable = true,
    loaded = true,
    params = {},
    participants = [],
    hasApiValidationErrors = false,
    submitReferralErrors = [],
    ...args
  }) {
    const props = {
      actions,
      editable,
      loaded,
      params,
      participants,
      hasApiValidationErrors,
      submitReferralErrors,
      ...args,
    }
    return shallow(<ScreeningPage {...props} />, {disableLifecycleMethods: true})
  }
  function renderScreeningPageWithLifecycle({
    actions: {
      setPageMode = () => null,
      fetchScreening = () => null,
      fetchHistoryOfInvolvements = () => null,
    },
    participants = [],
    screening = {},
    params = {},
    editable,
  }) {
    const props = {
      actions: {
        setPageMode,
        fetchScreening,
        fetchHistoryOfInvolvements,
      },
      params,
      participants,
      screening,
      editable,
    }
    return shallow(<ScreeningPage {...props}/>)
  }

  it('renders a breadCrumb', () => {
    const screeningPage = renderScreeningPage({})
    expect(screeningPage.find('Connect(BreadCrumb)').exists()).toEqual(true)
  })

  describe('componentDidMount', () => {
    it("sets the page mode to EDIT_MODE when url mode is 'edit' and editable is true", () => {
      const id = '222'
      const setPageMode = jasmine.createSpy('setPageMode')
      renderScreeningPageWithLifecycle({
        editable: true,
        actions: {setPageMode},
        params: {mode: 'edit', id: id},
      })
      expect(setPageMode).toHaveBeenCalledWith(EDIT_MODE)
    })

    it("sets the page mode to EDIT_MODE when url mode is 'edit' and editable is true and id is undefined", () => {
      const setPageMode = jasmine.createSpy('setPageMode')
      const id = undefined
      renderScreeningPageWithLifecycle({
        editable: true,
        actions: {setPageMode},
        params: {mode: 'edit', id: id},
      })
      expect(setPageMode).toHaveBeenCalledWith(EDIT_MODE)
    })

    it("sets the page mode to SHOW_MODE when url mode is 'show' and editable is true", () => {
      const id = '333'
      const setPageMode = jasmine.createSpy('setPageMode')
      renderScreeningPageWithLifecycle({
        editable: true,
        actions: {setPageMode},
        params: {mode: 'show', id: id},
      })
      expect(setPageMode).toHaveBeenCalledWith(SHOW_MODE)
    })

    describe('when the screening page URL ID is present', () => {
      const id = '222'
      let fetchScreening
      let fetchHistoryOfInvolvements
      beforeEach(() => {
        fetchScreening = jasmine.createSpy('fetchScreening')
        fetchHistoryOfInvolvements = jasmine.createSpy('fetchHistoryOfInvolvements')
        renderScreeningPageWithLifecycle({
          actions: {fetchScreening, fetchHistoryOfInvolvements},
          params: {id},
        })
      })

      it('fetches screening from the url ID', () => {
        expect(fetchScreening).toHaveBeenCalledWith(id)
      })

      it('fetches HOI for the screening from the url ID', () => {
        expect(fetchHistoryOfInvolvements).toHaveBeenCalledWith('screenings', id)
      })
    })
  })

  describe('render', () => {
    it('renders a page header', () => {
      expect(renderScreeningPage({}).find('Connect(PageHeader)').exists()).toBe(true)
    })

    it('passes the screening title to the page header', () => {
      const screeningPage = renderScreeningPage({screeningTitle: 'Screening 1'})
      const pageHeader = screeningPage.find('Connect(PageHeader)')
      expect(pageHeader.props().pageTitle).toEqual('Screening 1')
    })

    it('passes buttons to the screening header', () => {
      const pageHeader = renderScreeningPage({}).find('Connect(PageHeader)')
      expect(pageHeader.props().button.type).toEqual('button')
    })

    describe('with errors', () => {
      it('renders the error detail card', () => {
        const submitReferralErrors = ['a', 'b', 'c']
        const component = renderScreeningPage({
          mode: EDIT_MODE,
          submitReferralErrors,
          hasApiValidationErrors: true,
        })
        const card = component.find('ErrorDetail')
        expect(card.exists()).toEqual(true)
        expect(card.props().errors).toEqual(submitReferralErrors)
      })

      it('renders the hotline container with a generic error class', () => {
        const screeningPage = renderScreeningPage({screeningTitle: 'Screening 1', hasGenericErrors: true})
        expect(screeningPage.find('.hotline-container.generic-error').length).toEqual(1)
      })
    })
    describe('without errors', () => {
      it('does not render the error detail card', () => {
        const submitReferralErrors = []
        const component = renderScreeningPage({
          mode: EDIT_MODE,
          submitReferralErrors,
          hasApiValidationErrors: false,
        })
        const card = component.find('ErrorDetail')
        expect(card.exists()).toEqual(false)
      })

      it('renders the hotline container without a generic error class', () => {
        const screeningPage = renderScreeningPage({screeningTitle: 'Screening 1', hasGenericErrors: false})
        expect(screeningPage.find('.hotline-container.generic-error').length).toEqual(0)
      })
    })
    describe('in edit mode', () => {
      let component
      beforeEach(() => {
        component = renderScreeningPage({mode: EDIT_MODE})
      })

      it('does not render home and edit links', () => {
        expect(component.find({to: '/'}).exists()).toEqual(false)
        expect(component.find({to: '/screenings/1/edit'}).exists()).toEqual(false)
      })

      it('renders the history card', () => {
        const card = component.find('Connect(HistoryOfInvolvement)')
        expect(card.exists()).toEqual(true)
      })

      it('renders the relations card', () => {
        const card = component.find('Connect(RelationshipsCard)')
        expect(card.exists()).toEqual(true)
      })

      it('renders the referral id, if present', () => {
        const heading = renderScreeningPage({
          mode: SHOW_MODE,
          referralId: '123456',
        }).find('h1')
        expect(heading.text()).toEqual('Referral #123456')
      })

      it('renders the search card', () => {
        expect(component.find('Connect(PersonSearchForm)').exists()).toEqual(true)
        expect(component.find('Connect(PersonSearchForm)').props().isClientOnly).toBe(false)
      })
    })

    describe('in show mode', () => {
      let component
      beforeEach(() => {
        component = renderScreeningPage({
          mode: SHOW_MODE,
          participants: [{id: 'id-1'}, {id: 'id-2'}],
          params: {id: '1'},
        })
      })

      it('renders the home and edit link', () => {
        const homeLink = component.find({children: 'Home', to: '/'})
        const editLink = component.find({children: 'Edit', to: '/screenings/1/edit'})
        expect(homeLink.exists()).toBe(true)
        expect(editLink.exists()).toBe(true)
      })

      it('renders the screening information card', () => {
        const card = component.find(ScreeningInformationCard)
        expect(card.exists()).toEqual(true)
      })

      it('renders the participants card for each participant', () => {
        const cards = component.find('PersonCardView')
        expect(cards.length).toEqual(2)
      })

      it('renders the narrative card', () => {
        const card = component.find(NarrativeCard)
        expect(card.exists()).toEqual(true)
      })

      it('renders the incident information show card', () => {
        const card = component.find(IncidentInformationCard)
        expect(card.exists()).toEqual(true)
      })

      it('renders the allegations card', () => {
        const card = component.find(AllegationsCard)
        expect(card.exists()).toEqual(true)
      })

      it('renders the worker safety card', () => {
        const card = component.find(WorkerSafetyCard)
        expect(card.exists()).toEqual(true)
      })

      it('renders the history card', () => {
        const card = component.find('Connect(HistoryOfInvolvement)')
        expect(card.exists()).toEqual(true)
      })

      it('renders the cross report show card', () => {
        const card = component.find(CrossReportCard)
        expect(card.exists()).toEqual(true)
      })

      it('renders the decision show card', () => {
        const card = component.find(DecisionCard)
        expect(card.exists()).toEqual(true)
      })

      it('renders the person search card', () => {
        expect(component.find('Connect(PersonSearchForm)').exists()).toEqual(true)
        expect(component.find('Connect(PersonSearchForm)').props().isClientOnly).toBe(false)
      })
    })
  })

  describe('when screening is not loaded', () => {
    it('renders an empty div', () => {
      isFeatureActiveSpy.and.returnValue(true)
      expect(renderScreeningPage({loaded: false}).find('.container').childAt(0).html()).toEqual('<div></div>')
    })
  })

  describe('when the screening page is unmounted', () => {
    let actions

    beforeEach(() => {
      actions = {
        clearScreening: jasmine.createSpy('clearScreening'),
        clearRelationships: jasmine.createSpy('clearRelationships'),
        clearHistoryOfInvolvement: jasmine.createSpy('clearHistoryOfInvolvement'),
        clearPeople: jasmine.createSpy('clearPeople'),
      }
    })

    it('clears the screening', () => {
      const screeningPage = renderScreeningPage({actions})
      screeningPage.unmount()
      expect(actions.clearScreening).toHaveBeenCalled()
    })

    it('clears relationships', () => {
      const screeningPage = renderScreeningPage({actions})
      screeningPage.unmount()
      expect(actions.clearRelationships).toHaveBeenCalled()
    })

    it('clears HOI', () => {
      const screeningPage = renderScreeningPage({actions})
      screeningPage.unmount()
      expect(actions.clearHistoryOfInvolvement).toHaveBeenCalled()
    })

    it('clears people', () => {
      const screeningPage = renderScreeningPage({actions})
      screeningPage.unmount()
      expect(actions.clearPeople).toHaveBeenCalled()
    })
  })
})
