# Blockdown

A Markdown-like syntax that supports defining blocks of text.

## Introduction

If you are using Markdown with Front Matter, your existing Markdown files are probably already valid Blockdown! 🎉

Blockdown does not have opinions about which flavor of Markdown you should use, or which plugins you should support.

Instead it defines text blocks in such a way that *you* can decide what to do with them.

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

* `---!name` The delimiter must have a name, which is usually the content type, e.g. `mermaid`.
* `---!name#id` It can also include an identifier, if you need to identify a unique block.
* `---!name#id[metadata]` It can also include metadata, for things like display settings.

> Note: The metadata is enclosed in square brackets, but the exact content of the metadata is not an opinion enforced by Blockdown. You can use simple [ini style](https://en.wikipedia.org/wiki/INI_file) `[key1=value1,key2=value]`, or use plain JSON `[{"foo":"bar"}]` or use [JSON5](https://json5.org/) `[{foo:'bar'}]`. Blockdown syntax does not care–it leaves metadata interpretation up to you.

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
* `id` *(String, optional)* The identifier of the block or `undefined`, e.g. for `---!yaml#abc` the `id` would be `abc`.
* `metadata` *(String, optional)* The metadata string (unparsed!) of whatever is between the square brackets, e.g. for `---!yaml#abc[foo]` or `---!yaml[foo]` the `metadata` would be `foo`.
* `content` *(String, optional)* Any characters following the block delimiter, up to the next block delimiter or the end of the file.

## Backwards Compatibility

For backwards compatibility with Markdown + Front Matter documents, if the very first line is `---` that following block is interpreted as Front Matter, up to the the next Blockdown delimiter or `---` separator.

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

## Implementation

This project ships with a JavaScript implementation.

Simply import the `parse` function and pass it the string:

```js
import { readFileSync } from 'fs';
import { parse } from '@saibotsivad/blockdown';

const blockdown = parse(readFileSync('./test/many-chunks.md'));
```

## License

The project code 
