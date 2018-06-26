import {takeLatest, put, call, select} from 'redux-saga/effects'
import {STATUS_CODES, post, get} from 'utils/http'
import {
  CREATE_PERSON,
  createPersonSuccess,
  createPersonFailure,
} from 'actions/personCardActions'
import {fetchHistoryOfInvolvements} from 'actions/historyOfInvolvementActions'
import {fetchRelationships} from 'actions/relationshipsActions'
import {selectClientIds} from 'selectors/participantSelectors'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import {push} from 'react-router-redux'
import {
  createScreeningSuccess,
} from 'actions/screeningActions'

export function* sendPersonPayload(person) {
  const {screening_id, legacy_descriptor, sealed, sensitive} = person
  const {legacy_id, legacy_source_table} = legacy_descriptor || {}
  let id
  if (screening_id === undefined) {
    const newScreening = yield call(get, '/api/v1/screenings/new')
    const screeningResponse = yield call(post, '/api/v1/screenings', {screening: newScreening})
    id = screeningResponse.id
    yield put(createScreeningSuccess(screeningResponse))
    const screeningEditPath = `/screenings/${id}/edit`
    yield put(push(screeningEditPath))
  }
  const participantPayload = {
    participant: {
      screening_id: screening_id || id,
      legacy_descriptor: {
        legacy_id,
        legacy_table_name: legacy_source_table,
      },
      sealed: sealed || false,
      sensitive: sensitive || false,
    },
  }
  return yield call(post, '/api/v1/participants', participantPayload)
}

export function* createParticipant({payload: {person}}) {
  try {
    const response = yield* sendPersonPayload(person)
    yield put(createPersonSuccess(response))
    const clientIds = yield select(selectClientIds)
    yield put(fetchRelationships(clientIds))
    const screeningId = yield select(getScreeningIdValueSelector)
    yield put(fetchHistoryOfInvolvements('screenings', screeningId))
  } catch (error) {
    if (error.status === STATUS_CODES.forbidden) {
      yield call(alert, 'You are not authorized to add this person.')
    } else {
      yield put(createPersonFailure(error.responseJSON))
    }
  }
}
export function* createParticipantSaga() {
  yield takeLatest(CREATE_PERSON, createParticipant)
}
