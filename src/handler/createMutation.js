import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import isArray from 'lodash/isArray'
import { PENDING, FULFILLED, REJECTED } from './status'

const listsStatus = [PENDING, FULFILLED, REJECTED]

export const createMutation = (event) => {
  if (isEmpty(event)) throw new Error('Event is empty on create mutation vuex.')
  if (!isArray(event)) throw new Error('Event is not array.')

  let object = {}
  if (event) {
    event.forEach((item) => {
      let i = { ...item }
      if (!isNil(item.storeConfig)) i = { ...item.storeConfig }

      const { eventName = '', state = {}, api = false } = i || {}
      if (isEmpty(eventName) || isNil(eventName)) console.error('Required key `eventName` in store config.')

      const stateName = isEmpty(state) || isNil(state.name) ? eventName : state.name
      if (!stateName) return
      if (api) {
        object = {
          ...object,
          [`${eventName}_${PENDING}`](state) {
            state[stateName].status = FULFILLED
          },
          [`${eventName}_${FULFILLED}`](state, payload) {
            if (payload === undefined) return
            state[stateName].response = payload
            state[stateName].status = FULFILLED
          },
          [`${eventName}_${REJECTED}`](state, payload) {
            if (payload === undefined) return
            const { status = '', statusText = '', data = {} } = payload || {}
            state[stateName].response = {}
            state[stateName].error = {
              statusText,
              status,
              data
            }
            state[stateName].status = REJECTED
          }
        }
      } else {
        object = {
          ...object,
          [`${eventName}`](state, payload) {
            if (isNil(payload)) {
              console.error(`${eventName} payload is undefined.`)
              return
            }
            if (isNil(state[stateName])) console.error(`${stateName} state is undefined.`)
            state[stateName] = payload
          }
        }
      }
    })
  }
  return object
}
