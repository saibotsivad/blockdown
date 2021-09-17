// start of line followed by three dashes
//	^---
// start the brackets
// \[\[
// after that, the name is required, so capture any characters up to the `#` or `|`
// ([^#|]+)
// then, if there's an id we can capture it, which is the group starting
// with #, then any character up to the pipe |, but it's optional
// (?:#([^|]+))?
// then, if there's metadata we capture everything up to the end brackets
// (?:\|(.+))?
// then we find the closing brackets
// \]\]$?/

const SINGLE_LINE_BLOCK_MARKER = /^---\[\[([^#|]+)(?:#([^|]+))?(?:\|(.+))?]]$/
const MULTI_LINE_BLOCK_START_MARKER = /^---\[\[([^|#]+)(?:#([^|]+))?\|$/
const CODE_FENCE = /^```.*/
const LINE_BREAK = /\r?\n/

const resetState = obj => Object.assign(
	{},
	{
		position: 'content',
		escaped: false,
		name: 'markdown',
		id: undefined,
		metadata: [],
		content: []
	},
	obj || {}
)

export const parse = string => {
	const blocks = []
	const warnings = []
	const lines = string.split(LINE_BREAK)
	let state = resetState()

	// The initial content type is markdown, unless the first
	// line is `---` for compatability with existing frontmatter
	// based markdown files.
	if (lines[0] === '---') {
		state.name = 'frontmatter'
		lines.splice(0, 1) // skip parsing the first line
	}

	const makeBlock = () => {
		const block = {
			name: state.name
		}
		if (state.id) {
			block.id = state.id
		}
		if (state.metadata.length) {
			block.metadata = state.metadata.join('\n')
		}
		if (state.content.length) {
			block.content = state.content.join('\n')
		}
		blocks.push(block)
		state = resetState()
	}

	lines.forEach((line, index) => {
		if (state.name === 'frontmatter' && line === '---') {
			// We have reached the end of the initial frontmatter
			// block, so we finish it and mark the next block as
			// markdown, for compatability.
			makeBlock()
			state.name = 'markdown'
		} else if (state.position === 'metadata') {
			if (line === ']]') {
				// Mark the end of the metadata section. The closing
				// square brace is discarded.
				state.position = 'content'
			} else {
				state.metadata.push(line)
			}
		} else if (!state.escaped && line.startsWith('---[[')) {
			const multilineMetadata = line.endsWith('|')
			const match = multilineMetadata
				? MULTI_LINE_BLOCK_START_MARKER.exec(line)
				: SINGLE_LINE_BLOCK_MARKER.exec(line)

			if (match) {
				// If any blocks exist, this marks the start of
				// a new section. If no blocks exist, but there
				// is content, it means the start of a new section
				// and the previous section was the starting state
				// which is markdown.
				if (blocks.length || state.content.length) {
					makeBlock()
				}
				if (multilineMetadata) {
					state.position = 'metadata'
				}
				state.name = match[1].trim()
				if (match[2]) {
					state.id = match[2]
				}
				if (match[3]) {
					state.metadata.push(match[3])
				}
			} else {
				warnings.push({ line, code: 'UNPARSEABLE_MARKER', index })
				state.content.push(line)
			}
		} else {
			if (state.escaped && CODE_FENCE.test(line)) {
				state.escaped = false
			} else if (CODE_FENCE.test(line)) {
				state.escaped = true
			}
			if (state.position === 'metadata') {
				state.metadata.push(line)
			} else {
				state.content.push(line)
			}
		}
	})

	// wrap up last block
	if (lines.length > 0) {
		makeBlock()
	}

	return { blocks, warnings }
}
