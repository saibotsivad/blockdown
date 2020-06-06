export default {
	blocks: [
		{
			name: 'md',
			id: undefined,
			metadata: undefined,
			content: [
				'',
				'good',
				'',
				'---!',
				'',
				'bad',
				''
			].join('\n')
		}
	],
	warnings: [
		{
			index: 4,
			code: 'UNPARSEABLE_MARKER',
			line: '---!'
		}
	]
}
