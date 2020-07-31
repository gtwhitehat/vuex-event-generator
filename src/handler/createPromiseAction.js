import isArray from 'lodash/isArray'
import isNil from 'lodash/isNil'
import isEmpty from 'lodash/isEmpty'

export const createPromiseAction = async (action, store) => {
  const { types, promise } = await action
  if (types) {
    if (isNil(types) || isEmpty(types)) throw new Error('Action type is empty.')

    let PENDING = ''
    let FULFILLED = ''
    let REJECTED = ''

    // original format type.
    if (isArray(types)) {
      [PENDING, FULFILLED, REJECTED] = types
    }

    // new format type.
    if (!isArray(types)) {
      PENDING = `${types}_PENDING`
      FULFILLED = `${types}_FULFILLED`
      REJECTED = `${types}_REJECTED`
    }

    store.commit(PENDING)
    return new Promise((resolve) => {
      // new format promise action.
      let promiseAction = promise
      if (typeof promise === 'function') promiseAction = promise()
      promiseAction.then((res) => {
        const newResponse = isNil(res.data) ? res : res.data
        store.commit(FULFILLED, newResponse)
        resolve(newResponse)
      }).catch((err) => {
        if (err && err.response && err.response.data) {
          store.commit(REJECTED, err.response)
          resolve(err.response)
        } else {
          store.commit(REJECTED, err)
          resolve(err)
        }
      })
    })
  }
  return store.commit(action.type)
}
