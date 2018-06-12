import {Map} from 'immutable'
import {createSelector} from 'reselect'
import {selectParticipants} from 'selectors/participantSelectors'
import {participantFlag} from 'utils/accessIndicator'
import nameFormatter from 'utils/nameFormatter'

export const getPersonNamesSelector = createSelector(
  selectParticipants,
  (people) => people.reduce((namesMap, person) => (
    namesMap.set(person.get('id'), nameFormatter(person.toJS()))
  ), Map())
)
export const getPersonInformationFlagValuesSelector = createSelector(
  selectParticipants,
  (people) => people.reduce((informationFlagMap, person) => (
    informationFlagMap.set(person.get('id'), participantFlag(person.toJS()))
  ), Map())
)
export const getModeValueSelector = (state, personId) => {
  const screeningPage = state.get('screeningPage')
  return screeningPage.getIn(['peopleCards', personId], 'show')
}
