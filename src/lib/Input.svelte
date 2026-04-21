<script>
	let { value = $bindable('') } = $props();
</script>

<input class="input m-2" bind:value placeholder="Brugernavn" />