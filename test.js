'use strict'

const { equal } = require('tapeless')
const createFilter = require('./')

const filter = createFilter()
const { data } = filter()

equal
  .describe('returns lambda on init')
  .test(typeof filter, 'function')
  .describe('data empty', 'will default')
  .test(data.length, 0)

const source = { data: [1, 2, 3, 4] }
const lookup = { data: [5, 6, 7, 8] }
const result = filter(source, lookup)

equal
  .describe('input/output size is a match', 'will operate')
  .test(result.data.length, source.data.length)
