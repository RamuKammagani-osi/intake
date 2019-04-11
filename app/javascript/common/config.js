import {fetchFailure} from 'actions/systemCodesActions'
import {store} from 'store/configureStore'

export function config() {
  const {org: {intake: {config = {}} = {}} = {}} = window
  return config
}

export function isFeatureActive(feature) {
  return Boolean(config().active_features) && config().active_features.includes(feature)
}

export function isFeatureInactive(feature) {
  return !isFeatureActive(feature)
}

export function jsClipboardSupported() {
  return window.clipboardData === undefined
}

export function sdmPath() {
  return config().sdm_path
}

export function isHotline(location) {
  return location && location.pathname.indexOf('/screenings') >= 0
}

export function isSnapshot(location) {
  return location && location.pathname.indexOf('/snapshot') >= 0
}

export function isSearchByAddressOn(location) {
  return isHotline(location) ?
    isFeatureActive('address_search_hotline') :
    isFeatureActive('address_search_snapshot')
}

export function isAdvancedSearchOn(location) {
  return isSnapshot(location) ?
    isFeatureActive('advanced_search') : false
}

// Triggers page level error message on demand for tester to test error banner
window.displayError = () => store.dispatch(fetchFailure({error: true}))
