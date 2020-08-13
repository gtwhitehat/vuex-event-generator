import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import camelCase from 'lodash/camelCase'
import isArray from 'lodash/isArray'

export const createGetters = (event) => {
  if (isEmpty(event)) throw new Error('Event is empty on create getters vuex.')
  if (!isArray(event)) throw new Error('Event is not array.')
  let object = {}
  event.forEach((item) => {
    let i = { ...item }
    if (!isNil(item.storeConfig)) {
      i = {
        ...item.storeConfig
      }
    }

    const { getters = '', eventName = '', state = {} } = i || {}
    if (isEmpty(eventName) || isNil(eventName)) throw new Error('Required key `eventName` in store config.')
    const gettersName = isEmpty(getters) || isNil(getters) ? eventName : getters
    const stateName = isEmpty(state) || isNil(state.name) ? eventName : state.name
    object = {
      ...object,
      [`${camelCase(gettersName)}`](state) {
        return state[stateName] || {}
      }
    }
  })
  return object
}
