---
title: Normal Blog Post
published: 2020-03-27
foo:
  bar: fizz
---

All blocks start with `--!name`, for example here is a [mermaidjs](https://mermaid-js.github.io/) block:

---!mermaid

pie title What Voldemort doesn't have?
         "FRIENDS" : 2
         "FAMILY" : 3
         "NOSE" : 45

---!md

Now we are back to markdown.

Blocks can include an identifier as `--!name#id` for example if you
want to include data and reference it elsewhere:

---!csv#teams

Team ID,Team Name,Player Count
abc,Cool People,12
def,More Teams,7

---!md

You can link to [referenced blocks](#teams) but be careful: if your
markdown plugin generates ids from headers, you need to manage
collisions yourself.

If the block type plugin requires parameters, you can set them.

---!html{"version":"1.0"}

<blink>A bit of nostalgia.</blink>

---!md

When each plugin is executed, it is called asynchronously with the
block content, reference, and parameters, and also given the context
properties of the overall page:

```js
async function plugin({
	// <Object> Properties for the current block.
	block: {
		// <String> The name of the block, which maps to the plugin.
		name,
		// <String> The identifier of the block.
		id,
		// <Object> (Optional) Any parameters included.
		parameters
	},
	// <Object> (Optional) Frontmatter metadata at start of document.
	metadata: {
		// This example document would contain:
		title: 'Normal Blog Post',
		// Note: Dates are kept as strings, to avoid losing resolution.
		published: '2020-03-27',
		foo: {
			bar: 'fizz'
		}
	},
	// <Array> The list of all blocks, before processing. Used to
	//         support cross-block id referencing.
	blocks: [
		//
	]
}) {
	//plugin code here
}
```
