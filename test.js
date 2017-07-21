require('kpow')()

const test = require('tape')
const createFilter = require('./')

test('will default', (t) => {
  const filter = createFilter()
  const result = filter()

  t.equal(typeof filter, 'function', 'returns funtion on init')
  t.equal(result.data.length, 4)
  t.end()
})

test('will operate', (t) => {
  const source = new ImageData(1, 1)
  const lookup = new ImageData(2, 2)

  const filter = createFilter()
  const result = filter(source, lookup)

  t.ok(result instanceof source.constructor, 'input/output type is a match')
  t.equal(result.data.length, lookup.data.length, 'lookup/output size is a match')
  t.end()
})
