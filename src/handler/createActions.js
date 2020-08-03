import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import isNil from 'lodash/isNil'
import camelCase from 'lodash/camelCase'
import { createPromiseAction } from './createPromiseAction'

const prefix = 'Action'
const prefixRequest = 'Request'

export const createActions = (event, config = {}) => {
  if (isNil(config.request)) console.error('Required apis request.')
  if (isEmpty(event)) throw new Error('Event is empty on create actions vuex.')
  if (!isArray(event)) throw new Error('Event is not array.')

  let object = {}
  event.forEach((item) => {
    const { storeConfig: { action = '', eventName = '' } = {} } = item || {}
    if (isEmpty(eventName) || isNil(eventName)) throw new Error('Required key `eventName` in store config.')

    const actionName = isEmpty(action) || isNil(action) ? eventName : action
    if (!isNil(config.request) && config.request[`${eventName}${prefixRequest}`]) {
      object = {
        ...object,
        async [`${camelCase(actionName)}${prefix}`](store, payload) {
          return createPromiseAction({
            types: eventName,
            promise: config.request[`${eventName}${prefixRequest}`](item, payload)
          },
          store)
        }
      }
    }
  })
  return object
}
