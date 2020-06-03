export default {
	blocks: [
		{
			name: 'markdown',
			content: [
				'starts as markdown',
				''
			].join('\n')
		},
		{
			name: 'foo',
			content: [
				'',
				'has block',
				''
			].join('\n')
		},
		{
			name: 'markdown',
			content: [
				'',
				'back to markdown',
				''
			].join('\n')
		}
	],
	warnings: []
}
