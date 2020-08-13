import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import { PENDING } from './status'

const defaultState = {
  response: {},
  status: PENDING,
  error: null
}

export const createState = (event) => {
  if (isEmpty(event)) throw new Error('Event is empty on create state vuex.')
  let object = {}
  event.forEach((item) => {
    let i = { ...item }
    if (!isNil(item.storeConfig)) {
      i = {
        ...item.storeConfig
      }
    }

    const { eventName = '', state: { name = '', value = {} } = {}, api = '' } = i || {}
    if (isEmpty(eventName) || isNil(eventName)) throw new Error('Required key `eventName` in store config.')

    let listState = {}
    if (isNil(name) || isEmpty(name)) {
      listState = {
        ...listState,
        [eventName]: defaultState
      }
    } else {
      listState = {
        ...listState,
        [name]: api ? defaultState : value
      }
    }
    object = {
      ...object,
      ...listState
    }
  })
  return object
}
