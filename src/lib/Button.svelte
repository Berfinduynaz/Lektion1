<script>
	let { children, onclick } = $props();
</script>

<button class="btn" on:click={onclick}>
	{@render children()}
</button>