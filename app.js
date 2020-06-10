import { initialize } from './src/initialize.js'
import { parseHash } from './src/parse-hash.js'
import { updateLink } from './src/update-link.js'
import debounce from 'just-debounce-it'

const state = parseHash(window.location.hash && window.location.hash.replace(/^#/, ''))
const { link, editor, viewer } = initialize(state)

const updateViewer = () => {
	const { parse } = window['@saibotsivad/blockdown']
	viewer.$set(parse(state.text))
}

link.$on('click', () => {
	updateLink(state)
})

const update = debounce(event => {
	state.text = event.target.value
	updateViewer()
}, 400)

editor.$on('change', event => {
	update(event)
})

editor.$on('keyup', event => {
	update(event)
})

updateViewer()
