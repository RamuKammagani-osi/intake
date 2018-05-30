import {connect} from 'react-redux'
import {
  getPersonCSECDetailsSelector,
  getCSECRequireValidationSelector,
  getVisibleErrorsSelector,
} from 'selectors/screening/personCSECFormSelectors'
import {setField, touchField} from 'actions/peopleFormActions'
import PersonCSECForm from 'views/people/PersonCSECForm'

const mapStateToProps = (state, {personId}) => ({
  ...getPersonCSECDetailsSelector(state, personId).toJS(),
  showCSEC: getCSECRequireValidationSelector(state, personId),
  errors: getVisibleErrorsSelector(state, personId).toJS(),
})

const mapDispatchToProps = (dispatch, {personId}) => ({
  onBlur: (field) => dispatch(touchField(personId, [field])),
  onChange: (field, value) => dispatch(setField(personId, [field], value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PersonCSECForm)
