/**
 * Imports
 */

import compose from '@koax/compose'
import map from '@f/map'
import toPromise from '@f/to-promise'
import isGenerator from '@f/is-generator'
import isFunctor from '@f/is-functor'
import isIterator from '@f/is-iterator'

/**
 * Run middleware
 * @param  {Array} middleware middleware stack
 * @param  {Object} ctx
 * @return {Function}
 */

let run = (middleware, ctx) => {

  let composed = compose(middleware)

  return function dispatch (action, next) {
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
