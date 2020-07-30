import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import { PENDING, FULFILLED, REJECTED } from './status'

const listsStatus = [PENDING, FULFILLED, REJECTED]

export const createMutation = (event) => {
  if (isEmpty(event)) throw new Error('Event is empty on create mutation vuex.')
  let object = {}
  event.forEach((item) => {
    const { storeConfig: { eventName = '', state = {} } = {} } = item || {}
    if (isEmpty(eventName) || isNil(eventName)) throw new Error('Required key `eventName` in store config.')

    const stateName = isEmpty(state) || isNil(state.name) ? 'response' : state.name
    listsStatus.forEach((s) => {
      object = {
        ...object,
        [`${eventName}_${s}`](state, payload) {
          state[eventName][stateName] = payload
        }
      }
    })
  })
  return object
}
