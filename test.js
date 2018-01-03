'use strict'

const { equal } = require('tapeless')
const createFilter = require('./')

const filter = createFilter()
const { data } = filter()

equal(typeof filter, 'function', 'returns lambda on init', 'will default')
equal(data.length, 0)

const source = { data: [1, 2, 3, 4] }
const lookup = { data: [5, 6, 7, 8] }
const result = filter(source, lookup)

equal(result.data.length, source.data.length, 'input/output size is a match', 'will operate')
