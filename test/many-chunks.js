export default {
	blocks: [
		{
			name: 'frontmatter',
			content: [
				'foo: bar',
				'published: 2020-01-01',
				'updated: 2020-01-01 12:34'
			].join('\n')
		},
		{
			name: 'markdown',
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
			content: [
				'',
				'this is a fizz section',
				''
			].join('\n')
		},
		{
			name: 'foo3',
			metadata: 'fizz3',
			content: [
				'',
				'more things 1',
				''
			].join('\n')
		},
		{
			name: 'foo4',
			metadata: 'has blank content',
			content: [
				''
			].join('\n')
		},
		{
			name: 'foo5',
			metadata: 'has no content'
		},
		{
			name: 'foo6',
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
