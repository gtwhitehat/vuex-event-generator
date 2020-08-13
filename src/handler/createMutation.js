import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import { PENDING, FULFILLED, REJECTED } from './status'

const listsStatus = [PENDING, FULFILLED, REJECTED]

export const createMutation = (event) => {
  if (isEmpty(event)) console.error('Event is empty on create mutation vuex.')
  let object = {}
  event.forEach((item) => {
    let i = { ...item }
    if (!isNil(item.storeConfig)) {
      i = {
        ...item.storeConfig
      }
    }

    const { eventName = '', state = {}, api = false } = i || {}
    if (isEmpty(eventName) || isNil(eventName)) console.error('Required key `eventName` in store config.')

    const stateName = isEmpty(state) || isNil(state.name) ? eventName : state.name
    listsStatus.forEach((s) => {
      object = {
        ...object,
        [`${eventName}_${s}`](state, payload = {}) {
          if (isNil(payload)) return
          const { success = false, data = {} } = payload || {}
          if (success || !isNil(data)) {
            if (api) {
              state[stateName].response = payload
              state[stateName].status = FULFILLED
            } else state[stateName] = payload
          } else {
            state[stateName].error = payload
            state[stateName].status = REJECTED
          }
        }
      }
    })
  })
  return object
}
