<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/Button.svelte';
	import Input from '$lib/Input.svelte';

	let userName = $state('');
	let password = $state('');

	const btnclick = () => {
		if (userName === 'berfin' && password === 'duymaz') {
			goto('/dashboard');
		} else {
			alert('Login failed');
		}
	};
</script>

<div class="login-wrapper">
	<div class="login-card">
		<h1>Log ind</h1>
		<p>Velkommen</p>

		<div class="field">
			<Input bind:value={userName} placeholder="Brugernavn" />
		</div>

		<div class="field">
            <Input bind:value={password} placeholder="Adgangskode" type="password" />
		</div>

		<Button onclick={btnclick}>Login</Button>
	</div>
</div>