import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import isNil from 'lodash/isNil'
import camelCase from 'lodash/camelCase'
import { createPromiseAction } from './createPromiseAction'

const prefix = 'Action'
const prefixRequest = 'Request'

export const createActions = (event, config = {}) => {
  if (isEmpty(event)) {
    console.error('Event is empty on create actions vuex.')
    return false
  }
  if (!isArray(event)) {
    console.error('Event is not array.')
    return false
  }
  if (isNil(config.request)) {
    console.error('Required field request in action vuex.')
    return false
  }

  let object = {}
  event.forEach((item) => {
    let i = { ...item }
    if (!isNil(item.storeConfig)) i = { ...item.storeConfig }

    const { actions = '', eventName = '', api = false } = i || {}
    if (isEmpty(eventName) || isNil(eventName)) {
      console.error('Required key `eventName` in store config.')
      return false
    }

    const actionName = isEmpty(actions) || isNil(actions) ? eventName : actions

    if (actionName) {
      if (api) {
        const apiRequest = config.request[`${eventName}${prefixRequest}`]
        if (isNil(apiRequest)) {
          console.error(`'${eventName}${prefixRequest}' Request is not found.`)
          return false
        }
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
