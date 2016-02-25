/**
 * Imports
 */

import map from '@f/map'
import toPromise from '@f/to-promise'
import isGenerator from '@f/is-generator'
import isFunctor from '@f/is-functor'
import isIterator from '@f/is-iterator'
import isUndefined from '@f/is-undefined'
import compose from '@koax/compose'

/**
 * Run middleware
 * @param  {Array} middleware middleware stack
 * @param  {Object} ctx
 * @return {Function}
 */

let run = ctx => middleware => {
  let composed = compose(middleware)
  return dispatch

  function dispatch (action, next) {
    if (isUndefined(action)) return Promise.resolve()
    action = isMappable(action) ? action : composed(action, next, ctx)
    return toPromise(map(dispatch, action))
  }
}

/**
 * Is a value mappable
 * @param  {Obj}  val
 * @return {Boolean}
 */

function isMappable (val) {
  return isFunctor(val) || isGenerator(val) || isIterator(val)
}

/**
 * Exports
 */

export default run
