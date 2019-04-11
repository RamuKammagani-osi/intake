import React from 'react'
import {shallow} from 'enzyme'
import Footer from 'views/Footer'

describe('Footer', () => {
  let component
  beforeEach(() => {
    component = shallow(<Footer />)
  })

  it('renders an invisible header for accessibility outline', () => {
    const footer = component.find('div')
    expect(footer.exists()).toEqual(true)
    expect(footer.props()['aria-label']).toEqual('footer')
  })
})
