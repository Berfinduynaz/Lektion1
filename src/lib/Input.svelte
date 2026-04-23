<script>
	let { value = $bindable(''), type = 'text', placeholder = '' } = $props();
</script>

<input
	class="input m-2"
	type={type}
	bind:value
	placeholder={placeholder}
/>