import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import isArray from 'lodash/isArray'
import cloneDeep from 'lodash/cloneDeep'
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

    const { eventName = '', state = {}, api = false } = i || {}
    if (isEmpty(eventName) || isNil(eventName)) console.error('Required key `eventName` in store config.')

    let listState = {}
    const setStateName = isEmpty(state) && isNil(state.name) ? eventName : state.name
    const valueState = api ? cloneDeep(defaultState) : state.value
    listState = { ...listState, [setStateName]: valueState }
    object = {
      ...object,
      ...listState
    }
  })
  return object
}
