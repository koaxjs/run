/**
 * Imports
 */

import test from 'tape'
import run from '../src'
import isPromise from '@f/is-promise'
import middleware from '@f/middleware'
import compose from '@koax/compose'

/**
 * Tests
 */

test('should handle action', (t) => {
  t.plan(3)

  let dispatch = middleware(run())

  dispatch.use(function (action, next) {
    if (action === 'foo') return 'bar'
    if (action === 'qux') return next()
  })

  dispatch('foo').then(function (res) {
    t.equal(res, 'bar')
  })

  dispatch('qux').then(function (res) {
    t.equal(res, 'qux')
  })

  dispatch('woot').then(function (res) {
    t.equal(res, undefined)
  })
})

test('should dispatch yielded action', (t) => {
  t.plan(3)

  let dispatch = middleware(run())
  dispatch.use(function * (action, next) {
    if (action === 'foo') return 'foo ' + (yield 'bar')
    if (action === 'bar') return 'qux'
    else return 'woot'
  })

  dispatch('bar').then(function (res) {
    t.equal(res, 'qux')
  })

  dispatch('zoot').then(function (res) {
    t.equal(res, 'woot')
  })

  dispatch('foo').then(function (res) {
    t.equal('foo qux', res)
  })
})

test('should reolve yielded promise', (t) => {
  t.plan(2)
  let dispatch = middleware(run())
  dispatch.use(function * (action, next) {
    if (action === 'foo') return yield Promise.resolve('bar')
    if (!isPromise(action)) return 'qux'
    else return next()
  })

  dispatch('foo').then(function (res) {
    t.equal(res, 'bar')
  })

  dispatch('bar').then(function (res) {
    t.equal(res, 'qux')
  })
})

test('should resolve yielded action promise', (t) => {
  t.plan(3)
  let dispatch = middleware(run())
  dispatch.use(function * (action, next) {
    if (action === 'fetch') return yield Promise.resolve('google')
    return next()
  })
  dispatch.use(function * (action, next) {
    if (action === 'foo') return 'foo ' + (yield 'fetch')
    if (!isPromise(action)) return 'qux'
    else return next()
  })

  dispatch('foo').then(function (res) {
    t.equal(res, 'foo google')
  }).catch(function (err) {
    console.log('err', err)
  })

  dispatch('fetch').then(function (res) {
    t.equal(res, 'google')
  })

  dispatch('bar').then(function (res) {
    t.equal(res, 'qux')
  })
})

test('should resolve array of action promises', (t) => {
  t.plan(3)

  let dispatch = middleware(run())
    .use(function * (action, next) {
      if (action === 'fetch') return yield Promise.resolve('google')
      return next()
    })
    .use(function * (action, next) {
      if (action === 'post') return yield Promise.resolve('updated')
      return next()
    })
    .use(function * (action, next) {
      if (action === 'foo') return yield ['fetch', 'post']
      if (!isPromise(action)) return 'qux'
      else return next()
    })

  dispatch('foo').then(function (res) {
    t.deepEqual(res, ['google', 'updated'])
  })

  dispatch('fetch').then(function (res) {
    t.equal(res, 'google')
  })

  dispatch('post').then(function (res) {
    t.equal(res, 'updated')
  })
})

test('should have access to context', (t) => {
  t.plan(1)
  let dispatch = middleware(run({fetched: 'google'}))
    .use(function (action, next, ctx) {
      if (action === 'foo') return 'bar' + ctx.fetched
      if (action === 'qux') return next()
    })


  dispatch('foo').then(function (res) {
    t.equal(res, 'bargoogle')
  }).catch((err) => console.log(err))
})

test('should drop undefined', (t) => {
  t.plan(1)
  let dispatch = middleware(run()).use(function (action) {
    if (!action) throw new Error('should not receive undefined')
  })

  dispatch(undefined).then(function (res) {
    t.equal(res, undefined)
  })
})
