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
  if (isEmpty(event)) {
    console.error('Event is empty on create state vuex.')
    return false
  }
  if (!isArray(event)) {
    console.error('Event is not array.')
    return false
  }

  let object = {}
  event.forEach((item) => {
    let i = { ...item }
    if (!isNil(item.storeConfig)) i = { ...item.storeConfig }

    const { eventName = '', state: { name = '', value = defaultState } = {}, api = '' } = i || {}
    if (isEmpty(eventName) || isNil(eventName)) {
      console.error('Required key `eventName` in store config.')
      return false
    }

    let listState = {}
    const setStateName = isNil(name) || isEmpty(name) ? eventName : name

    if (api) {
      listState = {
        ...listState,
        [setStateName]: value
      }
    } else {
      listState = {
        ...listState,
        [setStateName]: value
      }
    }
    object = {
      ...object,
      ...listState
    }
  })
  return object
}
