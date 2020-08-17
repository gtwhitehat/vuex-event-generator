import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import isNil from 'lodash/isNil'

import { createState } from './createState'
import { createActions } from './createActions'
import { createMutation } from './createMutation'
import { createGetters } from './createGetters'

export const createStore = (event, config) => {
  const {
    request = {}, state = {}, actions = {}, mutations = {}, getters = {}
  } = config || {}
  if (isNil(config.request)) {
    console.error('Required field request in action vuex.')
    return false
  }
  if (isEmpty(event)) {
    console.error('Event is empty on create actions vuex.')
    return false
  }
  if (!isArray(event)) {
    console.error('Event is not array.')
    return false
  }

  return {
    state: () => ({
      ...createState(event),
      ...state
    }),
    actions: {
      ...createActions(event, { request }),
      ...actions
    },
    mutations: {
      ...createMutation(event),
      ...mutations
    },
    getters: {
      ...createGetters(event),
      ...getters
    }
  }
}
