<script>
export let label = ''
export let text = ''
</script>

<dt>{label}</dt>
<dd class="{text === '' ? 'empty' : ''}">{text}</dd>

<style>
dt {
	display: inline-block;
	border: 1px solid green;
}
dd {
	border: 1px solid black;
}
dd.empty {
	border: 1px solid red;
}
</style>
