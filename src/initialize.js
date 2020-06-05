import UpdateLink from './UpdateLink.html'
import OutputViewer from './OutputViewer.html'
import TextEditor from './TextEditor.html'

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
