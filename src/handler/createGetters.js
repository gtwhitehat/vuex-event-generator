import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import camelCase from 'lodash/camelCase'
import isArray from 'lodash/isArray'

export const createGetters = (event) => {
  if (isEmpty(event)) {
    console.error('Event is empty on create getters vuex.')
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
    const { getters = '', eventName = '', state = {} } = i || {}
    if (isEmpty(eventName) || isNil(eventName)) {
      console.error('Required key `eventName` in store config.')
      return false
    }
    const gettersName = isEmpty(getters) || isNil(getters) ? eventName : getters
    const stateName = isEmpty(state) || isNil(state.name) ? eventName : state.name
    object = {
      ...object,
      [`${camelCase(gettersName)}`](state) {
        if (isNil(state[stateName])) {
          console.error(`${stateName} state is not found.`)
          return {}
        }
        return state[stateName]
      }
    }
  })
  return object
}
