import {connect} from 'react-redux'
import PersonSearchResults from 'snapshots/PersonSearchResults'
import {
  selectPeopleResults,
  selectResultsTotalValue,
} from 'selectors/peopleSearchSelectors'

const mapStateToProps = state => {
  return {
    results: selectPeopleResults(state).toJS(),
    total: selectResultsTotalValue(state),
  }
}

export default connect(
  mapStateToProps
)(PersonSearchResults)
