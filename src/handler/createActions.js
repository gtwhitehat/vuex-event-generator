import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import isNil from 'lodash/isNil'
import camelCase from 'lodash/camelCase'
import { createPromiseAction } from './createPromiseAction'

const prefix = 'Action'
const prefixRequest = 'Request'

export const createActions = (event, config = {}) => {
  if (isNil(config.request)) console.error('Required field request in action vuex.')
  if (isEmpty(event)) console.error('Event is empty on create actions vuex.')
  if (!isArray(event)) console.error('Event is not array.')

  let object = {}
  event.forEach((item) => {
    let i = { ...item }
    if (!isNil(item.storeConfig)) {
      i = {
        ...item.storeConfig
      }
    }

    const { actions = '', eventName = '' } = i || {}
    if (isEmpty(eventName) || isNil(eventName)) console.error('Required key `eventName` in store config.')

    const actionName = isEmpty(actions) || isNil(actions) ? eventName : actions
    if (actionName) {
      object = {
        ...object,
        async [`${camelCase(actionName)}${prefix}`](store, payload = {}) {
          return createPromiseAction({
            types: eventName,
            promise: config.request[`${eventName}${prefixRequest}`](payload)
          },
          store)
        }
      }
    }
  })
  return object
}
