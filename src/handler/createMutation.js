import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import isArray from 'lodash/isArray'
import { PENDING, FULFILLED, REJECTED } from './status'

const listsStatus = [PENDING, FULFILLED, REJECTED]

export const createMutation = (event) => {
  if (isEmpty(event)) throw new Error('Event is empty on create mutation vuex.')
  if (!isArray(event)) throw new Error('Event is not array.')

  let object = {}
  event.forEach((item) => {
    let i = { ...item }
    if (!isNil(item.storeConfig)) i = { ...item.storeConfig }

    const { eventName = '', state = {}, api = false } = i || {}
    if (isEmpty(eventName) || isNil(eventName)) console.error('Required key `eventName` in store config.')

    const stateName = isEmpty(state) || isNil(state.name) ? eventName : state.name
    const isSetStateByName = !isNil(state.name)

    listsStatus.forEach((status) => {
      if (api) {
        object = {
          ...object,
          [`${eventName}_${status}`](state, payload = {}) {
            if (isNil(payload)) {
              console.error(`${eventName} payload is undefined.`)
              return
            }
            switch (status) {
              case FULFILLED:
                if (isSetStateByName) state[stateName] = payload
                else {
                  state[stateName].response = payload
                  state[stateName].status = FULFILLED
                }
                break
              case REJECTED:
                state[stateName].error = payload
                state[stateName].status = REJECTED
                break
              default:
                state[stateName].response = payload
                state[stateName].status = PENDING
            }
          }
        }
      } else {
        object = {
          ...object,
          [`${eventName}`](state, payload = {}) {
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
  })
  return object
}
