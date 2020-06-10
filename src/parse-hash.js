const defaultStartingText = `---
title: My Post
---

Some exciting words.

---!mermaid[size=large]

pie title NETFLIX
    "Time spent looking for movie" : 90
    "Time spent watching it" : 10

---!md

More words.

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
