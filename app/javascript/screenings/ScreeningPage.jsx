import {SHOW_MODE} from 'actions/screeningPageActions'
import PersonCardView from 'screenings/PersonCardView'
import PropTypes from 'prop-types'
import React from 'react'
import RelationshipsCardContainer from 'screenings/RelationshipsCardContainer'
import {Link} from 'react-router'
import HistoryOfInvolvementContainer from 'containers/screenings/HistoryOfInvolvementContainer'
import HistoryTableContainer from 'containers/common/HistoryTableContainer'
import EmptyHistory from 'views/history/EmptyHistory'
import PersonSearchFormContainer from 'containers/common/PersonSearchFormContainer'
import ErrorDetail from 'common/ErrorDetail'
import AllegationsCard from 'screenings/AllegationsCard'
import CrossReportCard from 'screenings/CrossReportCard'
import DecisionCard from 'screenings/DecisionCard'
import IncidentInformationCard from 'screenings/IncidentInformationCard'
import NarrativeCard from 'screenings/NarrativeCard'
import ScreeningInformationCard from 'screenings/ScreeningInformationCard'
import WorkerSafetyCard from 'screenings/WorkerSafetyCard'
import PageHeader from 'common/PageHeader'
import BreadCrumb from 'containers/common/BreadCrumb'
import {urlHelper} from 'common/url_helper.js.erb'

const isDuplicatePerson = (participants, personOnScreening) => (
  participants
    .filter((participant) => participant.legacy_id)
    .some((x) => x.legacy_id === personOnScreening.legacy_descriptor.legacy_id)
)

export class ScreeningPage extends React.Component {
  componentDidMount() {
    const {
      actions: {
        setPageMode,
        fetchScreening,
        fetchHistoryOfInvolvements,
      },
      params: {mode, id},
    } = this.props
    if (id) {
      setPageMode(mode || SHOW_MODE)
      fetchScreening(id)
      fetchHistoryOfInvolvements('screenings', id)
    } else {
      setPageMode('edit')
      fetchScreening(null)
    }
  }

  componentWillUnmount() {
    const {
      actions: {
        clearHistoryOfInvolvement,
        clearRelationships,
        clearPeople,
        clearScreening,
      },
    } = this.props
    clearHistoryOfInvolvement()
    clearRelationships()
    clearPeople()
    clearScreening()
  }

  onSelectPerson(person) {
    const {participants, params: {id}, actions: {createPerson}} = this.props
    const personOnScreening = {
      screening_id: id,
      legacy_descriptor: {
        legacy_id: person.legacyDescriptor && person.legacyDescriptor.legacy_id,
        legacy_source_table: person.legacyDescriptor && person.legacyDescriptor.legacy_table_name,
      },
    }
    if (!isDuplicatePerson(participants, personOnScreening)) {
      createPerson(personOnScreening)
    }
  }

  submitButton() {
    const {editable, disableSubmitButton, params: {id}, actions: {submitScreening}} = this.props
    if (editable) {
      return (
        <button type='button'
          className='btn primary-btn pull-right'
          disabled={disableSubmitButton}
          onClick={() => submitScreening(id)}
        >
          Submit
        </button>
      )
    } else {
      return (<div />)
    }
  }

  renderPersonSearchForm() {
    return (
      <PersonSearchFormContainer
        onSelect={(person) => this.onSelectPerson(person)}
        searchPrompt='Search for any person (Children, parents, reporters, alleged perpetrators...)'
        canCreateNewPerson={true}
        isClientOnly={false}
      />)
  }

  renderScreeningFooter() {
    const {mode, editable} = this.props
    return mode === SHOW_MODE && (
      <div>
        <Link to='/' className='gap-right'>Home</Link>
        {editable && <Link to={`/screenings/${this.props.params.id}/edit`}>Edit</Link>}
      </div>
    )
  }

  renderBody() {
    const {referralId, editable, hasApiValidationErrors, submitReferralErrors} = this.props
    return (
      <div className='col-xs-8 col-xs-offset-4 col-md-9 col-md-offset-3 hotline-inner-container'>
        {referralId && <h1>Referral #{referralId}</h1>}
        {hasApiValidationErrors && <ErrorDetail errors={submitReferralErrors} />}
        <ScreeningInformationCard />
        {editable && this.renderPersonSearchForm()}
        {this.props.participants.map(({id}) => <PersonCardView key={id} personId={id} />)}
        <NarrativeCard />
        <IncidentInformationCard />
        <AllegationsCard />
        <RelationshipsCardContainer />
        <WorkerSafetyCard />
        <HistoryOfInvolvementContainer empty={<EmptyHistory />} notEmpty={<HistoryTableContainer includesScreenings={true} />} />
        <CrossReportCard />
        <DecisionCard />
        {this.renderScreeningFooter()}
      </div>
    )
  }

  renderScreening() {
    const {loaded} = this.props

    if (loaded) {
      return (
        <div className='row'>
          {this.renderBody()}
        </div>
      )
    }
    return (<div />)
  }

  render() {
    const genericErrorClass = this.props.hasGenericErrors ? 'generic-error' : ''
    return (
      <div>
        <div>
          <PageHeader pageTitle={this.props.screeningTitle} button={this.submitButton()} />
          <BreadCrumb navigationElements={[<Link key={this.props.params.id} to={urlHelper('/')}>CaseLoad</Link>]}/>
        </div>
        <div className={`container hotline-container ${genericErrorClass}`}>
          {this.renderScreening()}
        </div>
      </div>
    )
  }
}

ScreeningPage.propTypes = {
  actions: PropTypes.object.isRequired,
  disableSubmitButton: PropTypes.bool,
  editable: PropTypes.bool,
  hasApiValidationErrors: PropTypes.bool,
  hasGenericErrors: PropTypes.bool,
  loaded: PropTypes.bool,
  mode: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  participants: PropTypes.array.isRequired,
  reference: PropTypes.string,
  referralId: PropTypes.string,
  screeningTitle: PropTypes.string,
  submitReferralErrors: PropTypes.array,
}

ScreeningPage.defaultProps = {
  mode: 'show',
}
