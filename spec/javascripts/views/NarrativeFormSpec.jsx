import NarrativeForm from 'views/NarrativeForm'
import React from 'react'
import {shallow} from 'enzyme'

describe('NarrativeForm', () => {
  const renderNarrative = ({onCancel = () => {}, onSave = () => {}, ...props}) => (
    shallow(
      <NarrativeForm onCancel={onCancel} onSave={onSave} {...props} />,
      {disableLifecycleMethods: true}
    )
  )

  it('displays the narrative text field', () => {
    const component = renderNarrative({reportNarrative: {value: 'This is my favorite screening'}})
    const narrativeField = component.find('FormField').childAt(0)
    expect(narrativeField.props().value).toEqual('This is my favorite screening')
  })

  it('displays errors', () => {
    const component = renderNarrative({reportNarrative: {errors: ['missing a thing']}})
    const narrativeField = component.find('FormField')
    expect(narrativeField.props().errors).toEqual(['missing a thing'])
  })

  it('calls onChange when the narrative changes', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderNarrative({onChange})
    component.find('textarea').simulate('change', {target: {value: 'New narrative'}})
    expect(onChange).toHaveBeenCalledWith('report_narrative', 'New narrative')
  })

  it('blurring narrative calls onBlur with the proper parameter', () => {
    const onBlur = jasmine.createSpy('onBlur')
    const component = renderNarrative({onBlur})
    component.find('textarea').simulate('blur')
    expect(onBlur).toHaveBeenCalledWith('report_narrative')
  })

  it('renders a card action row', () => {
    const component = renderNarrative({})
    expect(component.find('ActionRow').exists()).toEqual(true)
    expect(component.find('ActionRow').props().isSaving).not.toBeTruthy()
  })

  it('passes isSaving through to ActionRow', () => {
    const component = renderNarrative({isSaving: true})
    expect(component.find('ActionRow').props().isSaving).toEqual(true)
  })

  it('canceling edit calls onCancel', () => {
    const onCancel = jasmine.createSpy('onCancel')
    const component = renderNarrative({onCancel})
    component.find('ActionRow').props().onCancel()
    expect(onCancel).toHaveBeenCalled()
  })

  it('saving changes calls onSave', () => {
    const onSave = jasmine.createSpy('onSave')
    const component = renderNarrative({onSave})
    component.find('ActionRow').props().onSave()
    expect(onSave).toHaveBeenCalled()
  })
})
