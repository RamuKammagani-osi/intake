import AgeNumberSelect from 'common/search/age/AgeNumberSelect'
import React from 'react'
import {shallow} from 'enzyme'

const render = ({
  id = 'search-approximate-age-number',
  gridClassName = 'age-number-field',
  value = '',
  onChange = () => {},
  range = {},
  disabled = false,
}) => {
  const props = {
    id,
    gridClassName,
    value,
    onChange,
    range,
    disabled,
  }
  return shallow(<AgeNumberSelect {...props} />)
}

describe('AgeNumberSelect', () => {
  describe('layout', () => {
    it('renders the select field', () => {
      const component = render({value: '1', range: {min: 0, max: 1}})
      const selectField = component.find('SelectField')
      expect(selectField.exists()).toEqual(true)
      expect(selectField.find('option[value=0]').text()).toEqual('0')
    })

    it('renders a div with props', () => {
      const component = render({})
      expect(component.find('div').exists()).toBe(true)
      expect(typeof component.find('div').props().onClick).toEqual('function')
      expect(component.props().role).toEqual('presentation')
    })

    it('renders the options', () => {
      const component = render({range: {min: 0, max: 120}})
      const selectField = component.find('SelectField')
      expect(selectField.children().length).toEqual(122)
    })

    it('sets select component props', () => {
      const component = render({disabled: true})
      const selectField = component.find('SelectField')
      expect(selectField.props().id).toEqual('search-approximate-age-number')
      expect(selectField.props().gridClassName).toEqual('age-number-field')
      expect(selectField.props().label).toEqual('Number')
      expect(typeof selectField.props().onChange).toEqual('function')
      expect(selectField.props().value).toEqual('')
      expect(selectField.props().disabled).toEqual(true)
    })

    it('selects the value passed in', () => {
      const component = render({value: '2'})
      const selectField = component.find('SelectField')
      expect(selectField.props().value).toEqual('2')
    })
  })

  describe('event handlers', () => {
    describe('onChange', () => {
      describe('when select field value is selected', () => {
        describe('to a valid value', () => {
          it('calls back with the approximate age value', () => {
            const onChange = jasmine.createSpy('onChange')
            const component = render({value: '1', range: {min: 0, max: 1}, onChange})
            const selectField = component.find('SelectField')
            selectField.props().onChange({target: {value: '1'}})
            expect(onChange).toHaveBeenCalledWith('searchApproximateAge', '1')
          })
        })

        describe('to an unknown value', () => {
          it('calls back with empty string', () => {
            const onChange = jasmine.createSpy('onChange')
            const component = render({value: '1', range: {min: 0, max: 2}, onChange})
            const selectField = component.find('SelectField')
            selectField.props().onChange({target: {value: '100'}})
            expect(onChange).toHaveBeenCalledWith('searchApproximateAge', '')
          })
        })
      })
    })

    describe('onClick', () => {
      describe('when the select field parent is clicked', () => {
        it('onChange sets the searchByAgeMethod to approximate', () => {
          const onChange = jasmine.createSpy('onChange')
          const component = render({onChange})
          const selectFieldParent = component.find('div')
          selectFieldParent.props().onClick()
          expect(onChange).toHaveBeenCalledWith('searchByAgeMethod', 'approximate')
        })
      })
    })
  })
})