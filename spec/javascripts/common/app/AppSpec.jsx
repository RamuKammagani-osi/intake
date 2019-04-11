import {App} from 'common/app/App'
import React from 'react'
import {shallow, mount} from 'enzyme'
import * as IntakeConfig from 'common/config'
import {CaresProvider, Page} from '@cwds/components'

describe('App', () => {
  beforeEach(() => {
    spyOn(IntakeConfig, 'config').and.returnValue({base_path: 'intake'})
  })

  it('fetches user info when the component mounts', () => {
    const fetchUserInfoAction = jasmine.createSpy('fetchUserInfoAction')
    const fetchSystemCodesAction = jasmine.createSpy('fetchSystemCodesAction')
    const checkStaffPermission = jasmine.createSpy('checkStaffPermission')
    const actions = {fetchUserInfoAction, fetchSystemCodesAction, checkStaffPermission}
    mount(<App actions={actions}><div/></App>)
    expect(fetchUserInfoAction).toHaveBeenCalled()
    expect(fetchSystemCodesAction).toHaveBeenCalled()
    expect(checkStaffPermission).toHaveBeenCalledWith('add_sensitive_people')
  })

  it('renders a ScrollToTop wrapper', () => {
    const app = shallow(<App actions={{}}><div/></App>, {disableLifecycleMethods: true})
    const scrollToTop = app.find('withRouter(ScrollToTop)')
    expect(scrollToTop.exists()).toBe(true)
  })

  it('renders the Page component on all app views with layout as dashboard', () => {
    const app = shallow(<App actions={{}}><div/></App>, {disableLifecycleMethods: true})
    expect(app.find(Page).exists()).toBe(true)
    expect(app.find('Page[layout="dashboard"]').exists()).toBe(true)
  })

  it('renders its children', () => {
    const app = shallow(<App actions={{}}><div/></App>, {disableLifecycleMethods: true})
    expect(app.find('div').exists()).toBe(true)
  })

  it('renders a CaresProvider', () => {
    const fetchUserInfoAction = jasmine.createSpy('fetchUserInfoAction')
    const fetchSystemCodesAction = jasmine.createSpy('fetchSystemCodesAction')
    const checkStaffPermission = jasmine.createSpy('checkStaffPermission')

    const app = mount(<App actions={{fetchUserInfoAction, fetchSystemCodesAction, checkStaffPermission}} fullName={''}><div /></App>)

    expect(app.find(CaresProvider).length).toEqual(1)
    expect(app.find('CaresProvider[Brand="CWS-CARES"]').exists()).toBe(true)
  })
})
