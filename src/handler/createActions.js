import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import isNil from 'lodash/isNil'
import camelCase from 'lodash/camelCase'
import { createPromiseAction } from './createPromiseAction'

const prefix = 'Action'
const prefixRequest = 'Request'

export const createActions = (event, config = {}) => {
  if (isEmpty(event)) throw new Error('Event is empty on create actions vuex.')
  if (!isArray(event)) throw new Error('Event is not array.')
  if (isNil(config.request)) console.error('Required field request in action vuex.')

  let object = {}
  event.forEach((item) => {
    let i = { ...item }
    if (!isNil(item.storeConfig)) i = { ...item.storeConfig }

    const { actions = '', eventName = '', api = false } = i || {}
    if (isEmpty(eventName) || isNil(eventName)) throw new Error('Required key `eventName` in store config.')

    const actionName = isEmpty(actions) || isNil(actions) ? eventName : actions

    if (actionName) {
      if (api) {
        const apiRequest = config.request[`${eventName}${prefixRequest}`]
        if (isNil(apiRequest)) console.error(`'${eventName}${prefixRequest}' Request is not found.`)
        // api promise action
        object = {
          ...object,
          async [`${camelCase(actionName)}${prefix}`](store, payload = {}) {
            return createPromiseAction({
              types: eventName,
              promise: apiRequest(payload)
            },
            store)
          }
        }
      } else {
        // other Action
        object = {
          ...object,
          [`${camelCase(actionName)}${prefix}`](store, payload = {}) {
            store.commit(actionName, payload)
          }
        }
      }
    }
  })
  return object
}
