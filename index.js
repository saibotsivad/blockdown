const BLOCK_MARKER_REGEX = /---\!([^{#]+)((?:#)([^{]+))?({.+)?/
const CODE_FENCE = /^```.*/
const FRONTMATTER = Symbol('FRONTMATTER')

export const parse = string => {
	const lines = string.split(/\r?\n/)

	const blocks = []
	const warnings = []

	let type = 'markdown'
	let blockId = undefined
	let metadata = undefined
	let content = []
	let escaped = false

	const makeBlock = () => {
		blocks.push({
			type: type === FRONTMATTER
				? 'frontmatter'
				: type,
			id: blockId,
			metadata,
			content: content.length
				? content.join('\n')
				: undefined
		})
	}

	if (lines[0] === '---') {
		type = FRONTMATTER
		lines.splice(0, 1)
	}

	for (const line of lines) {
		if (type === FRONTMATTER && line === '---') {
			// finish frontmatter block
			makeBlock()

			// start the first block as markdown
			type = 'markdown'
			content = []
		} else if (!escaped && line.startsWith('---!')) {
			const match = BLOCK_MARKER_REGEX.exec(line)
			if (match) {
				// finish old block
				if (content.length || blocks.length) {
					makeBlock()
				}

				// start a new block
				type = match[1].trim()
				blockId = match[3] && match[3].trim() || undefined
				metadata = undefined
				content = []
				if (match[4]) {
					try {
						metadata = JSON.parse(match[4])
					} catch (ignore) {
						warnings.push({ line, code: 'UNPARSEABLE_METADATA' })
					}
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
