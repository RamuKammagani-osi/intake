import FormField from 'common/FormField'
import PropTypes from 'prop-types'
import React from 'react'

const SelectField = ({gridClassName, labelClassName, disabled, id, label, value, onChange, onBlur, children, required, errors, ariaLabel, onKeyPress}) => (
  <FormField
    htmlFor={id}
    label={label}
    labelClassName={labelClassName}
    gridClassName={gridClassName}
    errors={errors}
    required={required}
  >
    <select
      disabled={disabled}
      id={id}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      aria-required={required}
      aria-label={ariaLabel}
      required={required}
      onKeyPress={onKeyPress}
    >
      {children}
    </select>
  </FormField>
)

SelectField.propTypes = {
  ariaLabel: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.object,
  ]).isRequired,
  disabled: PropTypes.bool,
  errors: PropTypes.array,
  gridClassName: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.string,
}
export default SelectField
