export default {
	blocks: [
		{
			name: 'md',
			content: [
				'',
				'good',
				'',
				'---[[]]',
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
			line: '---[[]]'
		}
	]
}
