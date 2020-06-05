const defaultStartingText = `---
title: About Blockdown
created: 2020-06-04
---

Here is some markdown.

`

export const parseHash = hash => {
	const state = {
		text: defaultStartingText
	}

	if (hash) {
		try {
			const args = JSON.parse(atob(hash))
			state.text = args.text
		} catch (ignore) {
			console.error('could not parse url args', hash)
		}
	}

	return state
}
