import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import isArray from 'lodash/isArray'
import { PENDING } from './status'

const defaultState = {
  response: {},
  status: PENDING,
  error: null
}

export const createState = (event) => {
  if (isEmpty(event)) throw new Error('Event is empty on create state vuex.')
  if (!isArray(event)) throw new Error('Event is not array.')

  let object = {}
  event.forEach((item) => {
    let i = { ...item }
    if (!isNil(item.storeConfig)) i = { ...item.storeConfig }

    const { eventName = '', state: { name = '', value = {} } = {}, api = '' } = i || {}
    if (isEmpty(eventName) || isNil(eventName)) console.error('Required key `eventName` in store config.')

    let listState = {}
    const setStateName = isEmpty(name) ? eventName : name
    const valueState = isEmpty(value) ? defaultState : value

    if (api) {
      listState = {
        ...listState,
        [setStateName]: valueState
      }
    } else {
      listState = {
        ...listState,
        [setStateName]: valueState
      }
    }
    object = {
      ...object,
      ...listState
    }
  })
  return object
}
