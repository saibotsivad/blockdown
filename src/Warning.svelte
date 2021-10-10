<script>
import DefinitionList from './DefinitionList.svelte'

export let warning = {}

$: list = [
	{
		label: 'Line Number',
		text: warning.index
	},{
		label: 'Code',
		text: warning.code
	},{
		label: 'Line String',
		text: warning.line
	}
]
</script>

<DefinitionList {list} />
