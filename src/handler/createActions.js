import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import isNil from 'lodash/isNil'
import camelCase from 'lodash/camelCase'
import { createPromiseAction } from './createPromiseAction'

const suffix = 'Action'
const suffixRequest = 'Request'

export const createActions = (event, config = {}) => {
  if (isNil(config.request)) console.error('Required field request in action vuex.')
  if (isEmpty(event)) throw new Error('Event is empty on create actions vuex.')
  if (!isArray(event)) throw new Error('Event is not array.')

  let object = {}
  event.forEach((item) => {
    const { storeConfig: { action = '', eventName = '' } = {} } = item || {}
    if (isEmpty(eventName) || isNil(eventName)) throw new Error('Required key `eventName` in store config.')

    const actionName = isEmpty(action) || isNil(action) ? eventName : action
    if (!isNil(config.request) && config.request[`${eventName}${suffixRequest}`]) {
      object = {
        ...object,
        async [`${camelCase(actionName)}${suffix}`](store, payload) {
          return createPromiseAction({
            types: eventName,
            promise: config.request[`${eventName}${suffixRequest}`](payload)
          },
          store)
        }
      }
    }
  })
  return object
}
