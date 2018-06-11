import {Map, List, fromJS} from 'immutable'
import {buildSelector} from 'selectors'
import {
  getAddressTypesSelector,
  getEthnicityTypesSelector,
  getHispanicOriginCodesSelector,
  getLanguagesSelector,
  getRaceTypesSelector,
  getUnableToDetermineCodesSelector,
  systemCodeDisplayValue,
} from 'selectors/systemCodeSelectors'
import {zipFormatter} from '../utils/zipFormatter'
import {isPlacementHome} from './isPlacementHome'
import {RESIDENCE_TYPE} from 'enums/AddressType'
import {Maybe} from 'utils/maybe'

export const mapLanguages = (state, result) => buildSelector(
  getLanguagesSelector,
  () => (result.get('languages') || List()),
  (statusCodes, languages) => (
    languages
      .sort((first, second) => second.get('primary') - first.get('primary'))
      .map((language) => (
        systemCodeDisplayValue(language.get('id'), statusCodes))
      )

  )
)(state)

export const mapIsSensitive = (result) => (result.get('sensitivity_indicator', '').toUpperCase() === 'S')
export const mapIsSealed = (result) => (result.get('sensitivity_indicator', '').toUpperCase() === 'R')

export const mapRaces = (state, result) => buildSelector(
  getEthnicityTypesSelector,
  getRaceTypesSelector,
  getUnableToDetermineCodesSelector,
  () => (result.getIn(['race_ethnicity', 'race_codes']) || List()),
  () => result.get('unable_to_determine_code'),
  (ethnicityTypes, raceTypes, unableToDetermineCodes, races, unableToDetermineCode) => {
    if (unableToDetermineCode) {
      return List([systemCodeDisplayValue(unableToDetermineCode, unableToDetermineCodes)])
    } else {
      return races
        .map((race) => (Map({
          race: systemCodeDisplayValue(race.get('id'), raceTypes),
          race_detail: systemCodeDisplayValue(race.get('id'), ethnicityTypes),
        })))
    }
  }
)(state)

export const mapEthnicities = (state, result) => buildSelector(
  getHispanicOriginCodesSelector,
  () => (result.getIn(['race_ethnicity', 'hispanic_codes']) || List()),
  () => (result.getIn(['race_ethnicity', 'hispanic_origin_code'])),
  (hispanicOriginCodes, ethnicities, hispanicLatinoOriginCode) => fromJS({
    hispanic_latino_origin: systemCodeDisplayValue(hispanicLatinoOriginCode, hispanicOriginCodes),
    ethnicity_detail: ethnicities.map((ethnicity) => ethnicity.get('description')).toJS(),
  })
)(state)

const getStreetAddress = (address) =>
  `${address.get('street_number') || ''} ${address.get('street_name') || ''}`

const getDisplayType = (address, addressTypes) => {
  if (isPlacementHome(address)) {
    return 'Placement Home'
  } else {
    return systemCodeDisplayValue(address.getIn(['type', 'id']), addressTypes) || ''
  }
}

const isResidence = (address) => address.getIn(['type', 'id']) === RESIDENCE_TYPE

export const mapAddress = (state, result) => {
  const addressTypes = getAddressTypesSelector(state)

  return Maybe.of(result.get('addresses'))
    .map((as) => as.first())
    .filter(isResidence)
    .map((address) => Map({
      city: address.get('city'),
      state: address.get('state_code'),
      zip: zipFormatter(address.get('zip')),
      streetAddress: getStreetAddress(address),
      type: getDisplayType(address, addressTypes),
    })).valueOrElse(null)
}

export const mapPhoneNumber = (result) =>
  Maybe.of(result.get('addresses'))
    .map((as) => as.first())
    .filter(isResidence)
    .map((address) => address.get('phone_numbers'))
    .valueOrElse(List())

export const mapDoraPersonToParticipant = (state, person) => Map({
  date_of_birth: person.get('date_of_birth'),
  approximate_age: null,
  approximate_age_units: null,
  first_name: person.get('first_name'),
  middle_name: person.get('middle_name'),
  last_name: person.get('last_name'),
  gender: person.get('gender'),
  ssn: person.get('ssn'),
  sealed: mapIsSealed(person),
  sensitive: mapIsSensitive(person),
  phone_numbers: mapPhoneNumber(person),
  name_suffix: person.get('name_suffix'),
  addresses: List([(mapAddress(state, person) || Map())
    .mapKeys((k) => (k === 'streetAddress' ? 'street_address' : k))]),
  legacy_id: person.get('id') || person.getIn(['legacy_descriptor', 'legacy_id']),
  id: person.get('id') || person.getIn(['legacy_descriptor', 'legacy_id']),
  legacy_descriptor: person.get('legacy_descriptor'),
  roles: List(),
  languages: mapLanguages(state, person),
  races: mapRaces(state, person),
  ethnicity: mapEthnicities(state, person),
})
