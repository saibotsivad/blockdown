
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
    'use strict';

    function noop() { }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element$1(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update$1(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update$1($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    /* src/UpdateLink.svelte generated by Svelte v3.43.1 */

    function create_fragment$5(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			button = element$1("button");

    			button.innerHTML = `Update Link
	<img src="../docs/fontawesome/link-solid.svg" aria-hidden="true" alt="Link icon"/>`;
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);

    			if (!mounted) {
    				dispose = listen(button, "click", /*click_handler*/ ctx[0]);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(button);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$5($$self) {
    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	return [click_handler];
    }

    class UpdateLink extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});
    	}
    }

    /* src/DefinitionList.svelte generated by Svelte v3.43.1 */

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (16:2) {:else}
    function create_else_block(ctx) {
    	let dd;
    	let div;
    	let t0_value = /*definition*/ ctx[2].text + "";
    	let t0;
    	let t1;

    	return {
    		c() {
    			dd = element$1("dd");
    			div = element$1("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr(div, "class", "svelte-3cq9fc");
    			attr(dd, "class", "svelte-3cq9fc");
    		},
    		m(target, anchor) {
    			insert(target, dd, anchor);
    			append(dd, div);
    			append(div, t0);
    			append(dd, t1);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*list*/ 1 && t0_value !== (t0_value = /*definition*/ ctx[2].text + "")) set_data(t0, t0_value);
    		},
    		d(detaching) {
    			if (detaching) detach(dd);
    		}
    	};
    }

    // (12:2) {#if empty(definition.text)}
    function create_if_block$1(ctx) {
    	let dd;

    	return {
    		c() {
    			dd = element$1("dd");

    			dd.innerHTML = `<div class="svelte-3cq9fc">(nothing)</div> 
			`;

    			attr(dd, "class", "empty svelte-3cq9fc");
    		},
    		m(target, anchor) {
    			insert(target, dd, anchor);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(dd);
    		}
    	};
    }

    // (8:1) {#each list as definition}
    function create_each_block$1(ctx) {
    	let dt;
    	let t0_value = /*definition*/ ctx[2].label + "";
    	let t0;
    	let t1;
    	let show_if;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (show_if == null || dirty & /*list*/ 1) show_if = !!/*empty*/ ctx[1](/*definition*/ ctx[2].text);
    		if (show_if) return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block = current_block_type(ctx);

    	return {
    		c() {
    			dt = element$1("dt");
    			t0 = text(t0_value);
    			t1 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			attr(dt, "class", "svelte-3cq9fc");
    		},
    		m(target, anchor) {
    			insert(target, dt, anchor);
    			append(dt, t0);
    			append(dt, t1);
    			if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*list*/ 1 && t0_value !== (t0_value = /*definition*/ ctx[2].label + "")) set_data(t0, t0_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(dt);
    			if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function create_fragment$4(ctx) {
    	let dl;
    	let each_value = /*list*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	return {
    		c() {
    			dl = element$1("dl");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr(dl, "class", "svelte-3cq9fc");
    		},
    		m(target, anchor) {
    			insert(target, dl, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(dl, null);
    			}
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*empty, list*/ 3) {
    				each_value = /*list*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(dl, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(dl);
    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { list = [] } = $$props;
    	const empty = string => string === '' || string === undefined;

    	$$self.$$set = $$props => {
    		if ('list' in $$props) $$invalidate(0, list = $$props.list);
    	};

    	return [list, empty];
    }

    class DefinitionList extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { list: 0 });
    	}
    }

    /* src/Block.svelte generated by Svelte v3.43.1 */

    function create_fragment$3(ctx) {
    	let definitionlist;
    	let current;
    	definitionlist = new DefinitionList({ props: { list: /*list*/ ctx[0] } });

    	return {
    		c() {
    			create_component(definitionlist.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(definitionlist, target, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const definitionlist_changes = {};
    			if (dirty & /*list*/ 1) definitionlist_changes.list = /*list*/ ctx[0];
    			definitionlist.$set(definitionlist_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(definitionlist.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(definitionlist.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(definitionlist, detaching);
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let list;
    	let { block = {} } = $$props;

    	$$self.$$set = $$props => {
    		if ('block' in $$props) $$invalidate(1, block = $$props.block);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*block*/ 2) {
    			$$invalidate(0, list = [
    				{ label: 'Name', text: block.name },
    				{ label: 'ID', text: block.id },
    				{ label: 'Metadata', text: block.metadata },
    				{ label: 'Content', text: block.content }
    			]);
    		}
    	};

    	return [list, block];
    }

    class Block extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { block: 1 });
    	}
    }

    /* src/Warning.svelte generated by Svelte v3.43.1 */

    function create_fragment$2(ctx) {
    	let definitionlist;
    	let current;
    	definitionlist = new DefinitionList({ props: { list: /*list*/ ctx[0] } });

    	return {
    		c() {
    			create_component(definitionlist.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(definitionlist, target, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const definitionlist_changes = {};
    			if (dirty & /*list*/ 1) definitionlist_changes.list = /*list*/ ctx[0];
    			definitionlist.$set(definitionlist_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(definitionlist.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(definitionlist.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(definitionlist, detaching);
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let list;
    	let { warning = {} } = $$props;

    	$$self.$$set = $$props => {
    		if ('warning' in $$props) $$invalidate(1, warning = $$props.warning);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*warning*/ 2) {
    			$$invalidate(0, list = [
    				{
    					label: 'Line Number',
    					text: warning.index
    				},
    				{ label: 'Code', text: warning.code },
    				{ label: 'Line String', text: warning.line }
    			]);
    		}
    	};

    	return [list, warning];
    }

    class Warning extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { warning: 1 });
    	}
    }

    /* src/OutputViewer.svelte generated by Svelte v3.43.1 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (9:0) {#if warnings && warnings.length}
    function create_if_block_1(ctx) {
    	let h2;
    	let t1;
    	let ol;
    	let current;
    	let each_value_1 = /*warnings*/ ctx[1];
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c() {
    			h2 = element$1("h2");
    			h2.textContent = "Warnings";
    			t1 = space();
    			ol = element$1("ol");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr(h2, "class", "warning svelte-9zf9i8");
    			attr(ol, "class", "svelte-9zf9i8");
    		},
    		m(target, anchor) {
    			insert(target, h2, anchor);
    			insert(target, t1, anchor);
    			insert(target, ol, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*warnings*/ 2) {
    				each_value_1 = /*warnings*/ ctx[1];
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ol, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(h2);
    			if (detaching) detach(t1);
    			if (detaching) detach(ol);
    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    // (12:2) {#each warnings as warning, index}
    function create_each_block_1(ctx) {
    	let li;
    	let h3;
    	let t0;
    	let t1;
    	let warning;
    	let t2;
    	let current;
    	warning = new Warning({ props: { warning: /*warning*/ ctx[5] } });

    	return {
    		c() {
    			li = element$1("li");
    			h3 = element$1("h3");
    			t0 = text(/*index*/ ctx[4]);
    			t1 = space();
    			create_component(warning.$$.fragment);
    			t2 = space();
    			attr(h3, "class", "svelte-9zf9i8");
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			append(li, h3);
    			append(h3, t0);
    			append(li, t1);
    			mount_component(warning, li, null);
    			append(li, t2);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const warning_changes = {};
    			if (dirty & /*warnings*/ 2) warning_changes.warning = /*warning*/ ctx[5];
    			warning.$set(warning_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(warning.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(warning.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(li);
    			destroy_component(warning);
    		}
    	};
    }

    // (21:0) {#if blocks}
    function create_if_block(ctx) {
    	let h2;
    	let t1;
    	let ol;
    	let current;
    	let each_value = /*blocks*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c() {
    			h2 = element$1("h2");
    			h2.textContent = "Blocks";
    			t1 = space();
    			ol = element$1("ol");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr(h2, "class", "block svelte-9zf9i8");
    			attr(ol, "class", "svelte-9zf9i8");
    		},
    		m(target, anchor) {
    			insert(target, h2, anchor);
    			insert(target, t1, anchor);
    			insert(target, ol, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*blocks*/ 1) {
    				each_value = /*blocks*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ol, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(h2);
    			if (detaching) detach(t1);
    			if (detaching) detach(ol);
    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    // (24:2) {#each blocks as block, index}
    function create_each_block(ctx) {
    	let li;
    	let h3;
    	let t0;
    	let t1;
    	let block;
    	let t2;
    	let current;
    	block = new Block({ props: { block: /*block*/ ctx[2] } });

    	return {
    		c() {
    			li = element$1("li");
    			h3 = element$1("h3");
    			t0 = text(/*index*/ ctx[4]);
    			t1 = space();
    			create_component(block.$$.fragment);
    			t2 = space();
    			attr(h3, "class", "svelte-9zf9i8");
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			append(li, h3);
    			append(h3, t0);
    			append(li, t1);
    			mount_component(block, li, null);
    			append(li, t2);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const block_changes = {};
    			if (dirty & /*blocks*/ 1) block_changes.block = /*block*/ ctx[2];
    			block.$set(block_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(block.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(block.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(li);
    			destroy_component(block);
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*warnings*/ ctx[1] && /*warnings*/ ctx[1].length && create_if_block_1(ctx);
    	let if_block1 = /*blocks*/ ctx[0] && create_if_block(ctx);

    	return {
    		c() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (/*warnings*/ ctx[1] && /*warnings*/ ctx[1].length) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*warnings*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*blocks*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*blocks*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach(if_block1_anchor);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { blocks = '' } = $$props;
    	let { warnings = '' } = $$props;

    	$$self.$$set = $$props => {
    		if ('blocks' in $$props) $$invalidate(0, blocks = $$props.blocks);
    		if ('warnings' in $$props) $$invalidate(1, warnings = $$props.warnings);
    	};

    	return [blocks, warnings];
    }

    class OutputViewer extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { blocks: 0, warnings: 1 });
    	}
    }

    /* src/TextEditor.svelte generated by Svelte v3.43.1 */

    function create_fragment(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			textarea = element$1("textarea");
    			attr(textarea, "class", "svelte-1kl17bh");
    		},
    		m(target, anchor) {
    			insert(target, textarea, anchor);
    			set_input_value(textarea, /*text*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen(textarea, "input", /*textarea_input_handler*/ ctx[3]),
    					listen(textarea, "change", /*change_handler*/ ctx[1]),
    					listen(textarea, "keyup", /*keyup_handler*/ ctx[2])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) {
    				set_input_value(textarea, /*text*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(textarea);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { text = '' } = $$props;

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function textarea_input_handler() {
    		text = this.value;
    		$$invalidate(0, text);
    	}

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	return [text, change_handler, keyup_handler, textarea_input_handler];
    }

    class TextEditor extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, { text: 0 });
    	}
    }

    const element = id => window.document.getElementById(id);

    const initialize = state => {
    	const link = new UpdateLink({
    		target: element('update-link')
    	});

    	const editor = new TextEditor({
    		target: element('text-editor'),
    		props: {
    			text: state.text
    		}
    	});

    	const viewer = new OutputViewer({
    		target: element('output-viewer')
    	});

    	return { link, editor, viewer }
    };

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

`;

    const parseHash = hash => {
    	const state = {
    		text: defaultStartingText
    	};

    	if (hash) {
    		try {
    			const args = JSON.parse(atob(hash));
    			state.text = args.text;
    		} catch (ignore) {
    			console.error('could not parse url args', hash);
    		}
    	}

    	return state
    };

    const updateLink = state => {
    	const hash = `#` + btoa(JSON.stringify(state));
    	if (history.pushState) {
    		history.pushState(null, null, hash);
    	} else {
    		location.hash = hash;
    	}
    };

    var justDebounceIt = debounce;

    function debounce(fn, wait, callFirst) {
      var timeout = null;
      var debouncedFn = null;

      var clear = function() {
        if (timeout) {
          clearTimeout(timeout);

          debouncedFn = null;
          timeout = null;
        }
      };

      var flush = function() {
        var call = debouncedFn;
        clear();

        if (call) {
          call();
        }
      };

      var debounceWrapper = function() {
        if (!wait) {
          return fn.apply(this, arguments);
        }

        var context = this;
        var args = arguments;
        var callNow = callFirst && !timeout;
        clear();

        debouncedFn = function() {
          fn.apply(context, args);
        };

        timeout = setTimeout(function() {
          timeout = null;

          if (!callNow) {
            var call = debouncedFn;
            debouncedFn = null;

            return call();
          }
        }, wait);

        if (callNow) {
          return debouncedFn();
        }
      };

      debounceWrapper.cancel = clear;
      debounceWrapper.flush = flush;

      return debounceWrapper;
    }

    const state = parseHash(window.location.hash && window.location.hash.replace(/^#/, ''));
    const { link, editor, viewer } = initialize(state);

    const updateViewer = () => {
    	const { parse } = window['@saibotsivad/blockdown'];
    	viewer.$set(parse(state.text));
    };

    link.$on('click', () => {
    	updateLink(state);
    });

    const update = justDebounceIt(event => {
    	state.text = event.target.value;
    	updateViewer();
    }, 400);

    editor.$on('change', event => {
    	update(event);
    });

    editor.$on('keyup', event => {
    	update(event);
    });

    updateViewer();

})();
//# sourceMappingURL=app.js.map
