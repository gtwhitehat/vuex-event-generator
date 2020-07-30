import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import isNil from 'lodash/isNil'
import camelCase from 'lodash/camelCase'
import { actionMiddleware } from './actionMiddleware'

const prefix = 'Action'

export const createActions = (event, config) => {
  if (isNil(config.createRequestCreator)) throw new Error('Required function `createRequestCreator`.')
  if (typeof config.createRequestCreator !== 'function') throw new Error('`createRequestCreator` is not a function.')
  if (isEmpty(event)) throw new Error('Event is empty on create actions vuex.')
  if (!isArray(event)) throw new Error('Event is not array.')

  let object = {}
  event.forEach((item) => {
    const { storeConfig: { action = '', eventName = '' } = {} } = item || {}
    if (isEmpty(eventName) || isNil(eventName)) throw new Error('Required key `eventName` in store config.')
    const actionName = isEmpty(action) || isNil(action) ? eventName : action

    object = {
      ...object,
      [`${camelCase(actionName)}${prefix}`](store, payload) {
        return actionMiddleware({
          types: eventName,
          promise: config.createRequestCreator(item, payload)
        },
        store)
      }
    }
  })
  return object
}
