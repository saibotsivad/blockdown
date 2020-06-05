export const updateLink = state => {
	const hash = `#` + btoa(JSON.stringify(state))
	if (history.pushState) {
		history.pushState(null, null, hash)
	} else {
		location.hash = hash
	}
}
