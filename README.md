# Blockdown

A Markdown-like syntax that supports defining blocks of text.

If you are using Markdown with Front Matter, your existing Markdown files are probably already valid Blockdown! 🎉

Blockdown does not have opinions about which flavor of Markdown you should use, or which plugins you should support.

Instead it defines text blocks in such a way that *you* can decide what to do with them.

## Introduction

A typical Markdown blog post, using Front Matter, might look like this:

	---
	title: My Post
	---

	Some exciting words.

Suppose that you want to include a graph in the middle, using a library like [mermaid](https://mermaidjs.github.io/)?

You might be tempted to write something like:

	---
	title: My Post
	---

	Some exciting words.

	<div class="mermaid" data-size="large">
		pie title NETFLIX
		  "Time spent looking for movie" : 90
		  "Time spent watching it" : 10
	</div>

	More words.

Then when you convert the Markdown file to HTML you need to look for elements with the CSS `.mermaid` selector, grab the text, generate a chart, then plug it back in.

Sounds doable but... if only there was a better way... 🤔

With Blockdown, you define each block of text explicitly, using a delimiter that's easy for humans and computers alike to read:

* `---!name` The delimiter must have a name, which is usually the content type, e.g. `mermaid`.
* `---!name#id` It can also include an identifier, if you need to identify a unique block.
* `---!name#id[metadata]` It can also include metadata, for things like display settings.

> Note: The metadata is enclosed in square brackets, but the exact content of the metadata is not an opinion enforced by Blockdown. You can use simple [ini style](https://en.wikipedia.org/wiki/INI_file) `[key1=value1,key2=value]`, or use plain JSON `[{"foo":"bar"}]` or use [JSON5](https://json5.org/) `[{foo:'bar'}]`. Blockdown syntax simply does not care.

For backwards compatibility, if the very first line is `---` that following block is interpreted as Front Matter, up to the the next Blockdown delimiter or `---` separator. If the separator is used, the following block is treated as Markdown.

Our earlier example would simply be:

	---
	title: My Post
	---

	Some exciting words.

	---!mermaid[size=large]
		pie title NETFLIX
		  "Time spent looking for movie" : 90
		  "Time spent watching it" : 10

	---!md

	More words.

Or if we wanted to be more explicit, we could define each block:

	---!yaml
	title: My Post

	---!md

	Some exciting words.

	---!mermaid[size=large]
		pie title NETFLIX
		  "Time spent looking for movie" : 90
		  "Time spent watching it" : 10

	---!md

	More words.

Blockdown syntax doesn't care what the contents are, it only cares about separating the text contents into blocks, and leaves interpreting those blocks up to you.

Each block in a Blockdown document contains the following possible properties:

* `name` *(String, required)* The name of the block, e.g. for `---!yaml` the `name` would be `yaml`.
* `id` *(String, optional)* The identifier of the block or `undefined`, e.g. for `---!yaml#abc` the `id` would be `abc`.
* `metadata` *(String, optional)* The metadata string (unparsed!) of whatever is between the square brackets, e.g. for `---!yaml#abc[foo]` or `---!yaml[foo]` the `metadata` would be `foo`.
* `content` *(String, optional)* Any characters following the block delimiter, up to the next block delimiter or the end of the file.

## Implementation

This project ships with a JavaScript implementation. Using it is very simple:

```js
import { readFileSync } from 'fs';
import { parse } from '@saibotsivad/blockdown';

const blockdown = parse(readFileSync('./test/many-chunks.md'));
```

## License

The project code 
