import { parse } from './index.js'
import { readFileSync } from 'fs'
import { test } from 'zora'
import globbedTests from './globbed-tests.js'

const blockDelimiters = [
	[
		'only has a type',
		'---!foo',
		{
			type: 'foo',
			id: undefined,
			metadata: undefined,
			content: undefined
		}
	],[
		'has a type and data',
		'---!foo[bar]',
		{
			type: 'foo',
			id: undefined,
			metadata: 'bar',
			content: undefined
		}
	],[
		'has a type and id',
		'---!foo#bar',
		{
			type: 'foo',
			id: 'bar',
			metadata: undefined,
			content: undefined
		}
	],[
		'has a type and data',
		'---!foo#bar[fizz]',
		{
			type: 'foo',
			id: 'bar',
			metadata: 'fizz',
			content: undefined
		}
	]
]

test('block delimiters', t => {
	for (const [ message, delimiter, expected ] of blockDelimiters) {
		t.equal(parse(delimiter).blocks[0], expected, message)
	}
})

test('all test files', t => {
	for (const { path, export: expected } of globbedTests) {
		const string = readFileSync(
			path.replace(/\.js$/, '.md'),
			{ encoding: 'utf8' }
		)
		t.equal(parse(string), expected, path)
	}
})
