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
  if (isNil(config.request)) throw new Error('Required field request in action vuex.')
  if (isEmpty(event)) throw new Error('Event is empty on create actions vuex.')
  if (!isArray(event)) throw new Error('Event is not array.')

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
