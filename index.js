const BLOCK_MARKER_REGEX = /^---\!([^\[#]+)(?:(?:#)([^\[]+))?(?:\[([^\]]+))?/
const CODE_FENCE = /^```.*/
const FRONTMATTER = Symbol('FRONTMATTER')

export const parse = string => {
	const lines = string.split(/\r?\n/)

	const blocks = []
	const warnings = []

	let name = 'markdown'
	let id = undefined
	let metadata = undefined
	let content = []
	let escaped = false

	const makeBlock = () => {
		blocks.push({
			name: name === FRONTMATTER
				? 'frontmatter'
				: name,
			id,
			metadata,
			content: content.length
				? content.join('\n')
				: undefined
		})
		name = undefined
		id = undefined
		metadata = undefined
		content = []
		escaped = false
	}

	if (lines[0] === '---') {
		name = FRONTMATTER
		lines.splice(0, 1)
	}

	for (const line of lines) {
		if (name === FRONTMATTER && line === '---') {
			// finish frontmatter block
			makeBlock()

			// start the first block as markdown
			name = 'markdown'
			content = []
		} else if (!escaped && line.startsWith('---!')) {
			const match = BLOCK_MARKER_REGEX.exec(line)
			if (match) {
				// finish old block
				if (content.length || blocks.length) {
					makeBlock()
				}

				// start a new block
				name = match[1].trim()
				if (match[2]) {
					id = match[2]
				}
				if (match[3]) {
					metadata = match[3]
				}
			} else {
				warnings.push({ line, code: 'UNPARSEABLE_MARKER' })
				content.push(line)
			}
		} else {
			if (escaped && CODE_FENCE.test(line)) {
				escaped = false
			} else if (CODE_FENCE.test(line)) {
				escaped = true
			}
			content.push(line)
		}
	}

	// wrap up last block
	if (lines.length > 0) {
		makeBlock()
	}

	return { blocks, warnings }
}
