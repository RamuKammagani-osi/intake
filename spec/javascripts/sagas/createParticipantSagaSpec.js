import 'babel-polyfill'
import {takeLatest, put, call, select} from 'redux-saga/effects'
import {post, get} from 'utils/http'
import {
  createParticipant,
  createParticipantSaga,
} from 'sagas/createParticipantSaga'
import {CREATE_PERSON} from 'actions/personCardActions'
import {selectClientIds} from 'selectors/participantSelectors'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import * as personCardActions from 'actions/personCardActions'
import {fetchHistoryOfInvolvements} from 'actions/historyOfInvolvementActions'
import {fetchRelationships} from 'actions/relationshipsActions'
import {createScreeningSuccess} from 'actions/screeningActions'

describe('createParticipantSaga', () => {
  it('creates participant on CREATE_PERSON', () => {
    const gen = createParticipantSaga()
    expect(gen.next().value).toEqual(takeLatest(CREATE_PERSON, createParticipant))
  })
})

describe('createParticipant', () => {
  it('get new screening and post it if screening id is undefined', () => {
    const screening = {id: undefined}
    const action = personCardActions.createPerson(screening)
    const gen = createParticipant(action)
    expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/new'))
    expect(gen.next(screening).value).toEqual(call(post, '/api/v1/screenings', {screening}))
    expect(gen.next(screening).value).toEqual(
      put(createScreeningSuccess(screening))
    )
  })

  const params = {screening_id: '1', legacy_descriptor: {legacy_id: '1', legacy_table_name: 'table'}, sealed: false, sensitive: false}
  const participant = {
    first_name: 'Michael',
    screening_id: '1',
    legacy_descriptor: {
      legacy_id: '1',
      legacy_source_table: 'table',
    },
    sealed: false,
    sensitive: false,
  }
  const action = personCardActions.createPerson(participant)

  it('creates and puts participant and fetches relationships and history', () => {
    const gen = createParticipant(action)
    expect(gen.next().value).toEqual(call(post, '/api/v1/participants', {participant: params}))
    expect(gen.next(participant).value).toEqual(
      put(personCardActions.createPersonSuccess(participant))
    )

    expect(gen.next().value).toEqual(select(selectClientIds))
    const clientIds = ['123', '456']
    expect(gen.next(clientIds).value).toEqual(
      put(fetchRelationships(clientIds))
    )
    expect(gen.next().value).toEqual(select(getScreeningIdValueSelector))
    const screeningId = '444'
    expect(gen.next(screeningId).value).toEqual(
      put(fetchHistoryOfInvolvements('screenings', screeningId))
    )
  })

  it('puts errors when non-403 errors are thrown', () => {
    const gen = createParticipant(action)
    expect(gen.next().value).toEqual(call(post, '/api/v1/participants', {participant: params}))
    const error = {responseJSON: 'some error'}
    expect(gen.throw(error).value).toEqual(
      put(personCardActions.createPersonFailure('some error'))
    )
  })

  it('calls an alert when the error status is 403', () => {
    const gen = createParticipant(action)
    expect(gen.next().value).toEqual(call(post, '/api/v1/participants', {participant: params}))
    const error = {responseJSON: 'some error', status: 403}
    expect(gen.throw(error).value).toEqual(
      call(alert, 'You are not authorized to add this person.')
    )
  })
})
