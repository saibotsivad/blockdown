export default {
	blocks: [
		{
			name: 'name1',
			id: 'id1',
			metadata: 'data1',
			content: [
				'',
				'normal',
				''
			].join('\n')
		},
		{
			name: 'name2',
			id: 'id2',
			metadata: '  data2  ',
			content: [
				'',
				'spaces preserved',
				''
			].join('\n')
		},
		{
			name: 'name3',
			id: 'id3',
			metadata: '  data3',
			content: [
				'',
				'multiline metadata',
				''
			].join('\n')
		},
		{
			name: 'name4',
			id: 'id4',
			metadata: [
				'',
				'  data4',
				''
			].join('\n'),
			content: [
				'',
				'newlines preserved',
				''
			].join('\n')
		},
		{
			name: 'name5',
			id: 'id5',
			metadata: '  ]',
			content: [
				'',
				'any characters allowed',
				''
			].join('\n')
		}
	],
	warnings: []
}
