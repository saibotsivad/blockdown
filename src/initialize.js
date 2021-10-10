import UpdateLink from './UpdateLink.svelte'
import OutputViewer from './OutputViewer.svelte'
import TextEditor from './TextEditor.svelte'

const element = id => window.document.getElementById(id)

export const initialize = state => {
	const link = new UpdateLink({
		target: element('update-link')
	})

	const editor = new TextEditor({
		target: element('text-editor'),
		props: {
			text: state.text
		}
	})

	const viewer = new OutputViewer({
		target: element('output-viewer')
	})

	return { link, editor, viewer }
}
