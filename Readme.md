
# run

[![Build status][travis-image]][travis-url]
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
[![Code style][standard-image]][standard-url]

Run a koax middleware stack.

This is the raw middleware stack runner. The basic principal of the runner is that values that are yielded in the middleware stack are dispatched back through the middleware stack to get resolved. yielded functors (arrays, generators, and iterators) aren't dispatched directly - instead the functors values are mapped, using predefined mapping functions, over the middleware stack.

## Installation

    $ npm install @koax/run

## Usage

```js
import run from '@koax/run'

let dispatch = run([
  function * (action, next) {
    if (action === 'foo') return 'bar'
    else if (action === 'qux') return yield 'foo'
    return next()
  },
  function * (action, next) {
    if (action === 'multi') return yield ['foo', 'qux']
    return next()
  }
])

dispatch('foo').then((res) => res) // => 'bar'
disaptch('qux').then((res) => res) // => 'bar'
disaptch('multi').then((res) => res) // => ['bar', 'bar']

```

## API

### run(middleware, ctx)

- `middleware` - koax middleware array
- `ctx` - ctx for middleware stack

**Returns:** dispatch function: `dispatch(action, next)`

## License

MIT

[travis-image]: https://img.shields.io/travis/koaxjs/run.svg?style=flat-square
[travis-url]: https://travis-ci.org/koaxjs/run
[git-image]: https://img.shields.io/github/tag/koaxjs/run.svg
[git-url]: https://github.com/koaxjs/run
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
[standard-url]: https://github.com/feross/standard
[npm-image]: https://img.shields.io/npm/v/@koax/run.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@koax/run
