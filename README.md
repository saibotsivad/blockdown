# Blockdown

A Markdown-like syntax that supports defining blocks of text.

## Introduction

If you are using Markdown with Front Matter, your existing Markdown files are probably already valid Blockdown! 🎉

Blockdown does not have opinions about which flavor of Markdown you should use, or which plugins you should support.

Instead, it defines text blocks in such a way that *you* can decide what to do with them.

## Why?

A typical Markdown blog post, using Front Matter, might look like this:

```
---
title: My Post
---

Some exciting words.
```

Suppose that you want to include a graph in the middle, using a library like [mermaid](https://mermaidjs.github.io/)?

You might be tempted to write something like:

```
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
```

Then when you convert the Markdown file to HTML you would look for elements with the CSS `.mermaid` selector, grab the text, generate a chart, then plug it back in to your HTML.

Sounds doable but... if only there was a better way... 🤔

## How it Works

With Blockdown, you define each block of text explicitly, using a delimiter that's easy for humans and computers alike to read:

* `---!name` The delimiter **must** have a name, which is usually the content type, e.g. `mermaid`.
* `---!name#id` It can also include an identifier, if you need to identify a unique block.
* `---!name[metadata]` It can also include metadata, for things like display settings.
* `---!name#id[metadata]` Of course, it can include an identifier *and* metadata.

> Note: The metadata is enclosed in square brackets, but the exact syntax of the metadata is **not** specified by Blockdown. Blockdown syntax ***does not care***–it leaves metadata interpretation up to you.

Our earlier example, written in fully explicit format, would be:

```
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
```

Blockdown syntax doesn't care what the contents are, it only cares about separating the text contents into blocks, and leaves interpreting those blocks up to you.

Each block in a Blockdown document contains the following possible properties:

* `name` *(String, required)* The name of the block, e.g. for `---!yaml` the `name` would be `yaml`.
* `id` *(String, optional)* The optional identifier of the block, e.g. for `---!yaml#abc` the `id` would be `abc`.
* `metadata` *(String, optional)* The optional metadata string of whatever is between the square brackets, e.g. for `---!yaml#abc[foo]` or `---!yaml[foo]` the `metadata` would be `foo`.
* `content` *(String, optional)* Any characters following the block delimiter, up to the next block delimiter or the end of the file.

## Backwards Compatibility

For backwards compatibility with Markdown + [Front Matter](https://jekyllrb.com/docs/front-matter/) documents, if the very first line is `---` then the following block is interpreted as Front Matter, up to the next Blockdown delimiter or `---` separator.

If the `---` separator is used (instead of a Blockdown delimiter), the following block is treated as Markdown.

So our earlier example could simply be:

```
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
```

## Multi-Line Metadata

You may find that single-line metadata gets cumbersome with large metadata sets.

To use multi-line metadata, you end the delimiter with `[` (the left square bracket), and close the metadata section with a line containing only the `]` character (right square bracket).

For example:

```
---!mermaid[
  size=large
  color=red
]

pie title NETFLIX
	"Time spent looking for movie" : 90
	"Time spent watching it" : 10

---!md

More words.
```

> Note: the indentation of the metadata here is optional.

## Implementation

This project ships with a JavaScript implementation.

Simply import the `parse` function and pass it the string:

```js
import { readFileSync } from 'fs';
import { parse } from '@saibotsivad/blockdown';

const blockdown = parse(readFileSync('./test/many-chunks.md', 'utf8'));
console.log(blockdown.blocks[3].metadata); // => 'fizz3'
```

### API: `parse(<String>): Object<blocks: Array, warnings: Array>`

This implementation has a very simple API, you simply call the `parse` function with the string you want parsed.

The returned object contains two potential properties:

#### `blocks: Array<Object>`

The `blocks` property is an array of all parsed Blockdown blocks, it
contains the following properties:

* `name` (`String`, optional) - The name of the block, e.g. for `---!yaml` this property would be `yaml`.
* `id` (`String`, optional) - The `id` of the block, e.g. for `---!yaml#part1` this property would be `part1`.
* `metadata` (`String`, optional) - The metadata exactly as represented in the Blockdown block, e.g. without metadata type parsing or de-indentation on multi-line metadata.
* `content` (`String`, optional) - The content between block delimiters.

### `warnings: Array<Object>`

The `warnings` property is an array of all recoverable parser errors encountered. The array will always exist, but if there were no errors it will be empty.

It contains the following properties:

* `index` (`Integer`) - The zero-index line number where the error was first detected.
* `code` (`String`) - The meant-for-machines name of the error type. (As of `1.1.0`, only `UNPARSEABLE_MARKER` is used.)
* `line` (`String`) - The text found at the line where the error was first detected.

## License

The project code and all specs are published under the [Very Open License](http://veryopenlicense.com/).
