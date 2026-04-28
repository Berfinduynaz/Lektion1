<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/Button.svelte';
	import Input from '$lib/Input.svelte';

	let userName = $state('');
	let password = $state('');

	const btnclick = async () => {
		const response = await fetch('/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username: userName,
				password: password
			})
		});

		const result = await response.json();

		if (result.success) {
			localStorage.setItem('userId', result.userId);
			goto('/dashboard');
		} else {
			alert(result.message);
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

		<!-- 👇 KNAP UNDER LOGIN -->
		<div style="margin-top: 15px;">
			<a href="/admin">
				<button style="background-color: #1f4d3a; color: white;">
					Opret bruger
				</button>
			</a>
		</div>
	</div>
</div>