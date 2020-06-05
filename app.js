import { initialize } from './src/initialize.js'
import { parseHash } from './src/parse-hash.js'
import { updateLink } from './src/update-link.js'

const state = parseHash(window.location.hash && window.location.hash.replace(/^#/, ''))
const { link, editor, viewer } = initialize(state)

const updateViewer = () => {
	const { parse } = window['@saibotsivad/blockdown']
	viewer.$set(parse(state.text))
}

link.$on('click', () => {
	updateLink(state)
})

editor.$on('change', change => {
	state.text = change.target.value
	updateViewer()
})

updateViewer()
