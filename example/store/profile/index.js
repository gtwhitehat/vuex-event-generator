import { createStore } from 'vuex-event-generator'
import event from './constant.json'

const request = {}

// Custom state
const state = {
  testState: 'test state'
}

// Custom actions
const actions = {
  testAction(store, payload) {
    store.commit('testMutaion', payload)
  }
}

// Custom mutations
const mutations = {
  testMutaion(state, payload) {
    state.users = payload
  }
}

// Custom getters
const getters = {
  testGetters(state) {
    return state.users
  }
}

export default {
  ...createStore(event, {
    request,
    state,
    actions,
    mutations,
    getters
  })
}
