export default {
	blocks: [
		{
			name: 'frontmatter',
			id: undefined,
			metadata: undefined,
			content: [
				'foo: bar',
				'published: 2020-01-01',
				'updated: 2020-01-01 12:34'
			].join('\n')
		},
		{
			name: 'markdown',
			id: undefined,
			metadata: undefined,
			content: [
				'',
				'# This is markdown',
				'',
				'with words',
				'',
				'---',
				'',
				'still markdown that was an hr because no curly',
				'',
				'```',
				'---!fizz1',
				'```',
				'',
				'that wasn\'t a break because it was in a code block',
				''
			].join('\n')
		},
		{
			name: 'fizz2',
			id: undefined,
			metadata: undefined,
			content: [
				'',
				'this is a fizz section',
				''
			].join('\n')
		},
		{
			name: 'foo3',
			id: undefined,
			metadata: 'fizz1',
			content: [
				'',
				'more things 1',
				''
			].join('\n')
		},
		{
			name: 'foo4',
			id: undefined,
			metadata: 'has blank content',
			content: [
				''
			].join('\n')
		},
		{
			name: 'foo5',
			id: undefined,
			metadata: 'has no content',
			content: undefined
		},
		{
			name: 'foo6',
			id: undefined,
			metadata: '    lots of spaces   ',
			content: [
				'',
				'more things 2',
				''
			].join('\n')
		},
		{
			name: 'foo7',
			id: 'ref1',
			metadata: undefined,
			content: [
				'',
				'has a reference',
				''
			].join('\n')
		},
		{
			name: 'foo8',
			id: 'ref2',
			metadata: 'fizz3',
			content: [
				'',
				'even more things',
				''
			].join('\n')
		}
	],
	warnings: []
}
