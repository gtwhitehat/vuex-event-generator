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
  if (event) {
    event.forEach((item) => {
      let i = { ...item }
      if (!isNil(item.storeConfig)) i = { ...item.storeConfig }

      const { actions = {}, eventName = '', api = false } = i || {}
      if (isEmpty(eventName) || isNil(eventName)) throw new Error('Required key `eventName` in store config.')

      let getActionName = eventName
      if (!isEmpty(actions.name) || !isNil(actions.name)) {
        if (typeof actions === 'string') {
          getActionName = actions
        } else {
          getActionName = actions.name
        }
      }

      const { suffix = true } = actions
      const actionName = suffix ? `${camelCase(getActionName)}${prefix}` : `${camelCase(getActionName)}`

      if (actionName) {
        if (api) {
          const apiRequest = config.request[`${eventName}${prefixRequest}`]
          if (isNil(apiRequest)) console.error(`'${eventName}${prefixRequest}' Request is not found.`)
          // api promise action
          object = {
            ...object,
            async [actionName](store, payload = {}) {
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
            [actionName](store, payload = {}) {
              store.commit(actionName, payload)
            }
          }
        }
      }
    })
  }
  return object
}
