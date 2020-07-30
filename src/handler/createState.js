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
    const { storeConfig: { eventName = '', state: { name = '', defaultValue = {} } = {} } = {} } = item || {}
    if (isEmpty(eventName) || isNil(eventName)) throw new Error('Required key `eventName` in store config.')

    const listState = isNil(name) || isEmpty(name) ? defaultState : { [name]: defaultValue }
    object = {
      ...object,
      [eventName]: {
        ...listState
      }
    }
  })
  return object
}
