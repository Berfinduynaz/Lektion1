<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/Button.svelte';
	import Input from '$lib/Input.svelte';

	let userName = $state('');
	let password = $state('');

	const btnclick = () => {
		if (userName === 'admin' && password === 'admin') {
			goto('/home');
		} else {
			alert('Login failed');
		}
	};
</script>

<div>
	<Input bind:value={userName} placeholder="Brugernavn" />
</div>
<div>
	<Input bind:value={password} placeholder="Kodeord" />
</div>
<div>
	<Button onclick={btnclick}>Login</Button>
</div>