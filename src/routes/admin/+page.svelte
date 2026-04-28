<script>
	import Input from '$lib/Input.svelte';

	let newUserName = '';
	let newPassword = '';

	const createUser = async () => {
		const response = await fetch('/api/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username: newUserName,
				password: newPassword
			})
		});

		const result = await response.json();

		if (result.success) {
			alert('Bruger oprettet');
			newUserName = '';
			newPassword = '';
		} else {
			alert(result.message);
		}
	};
</script>

<div class="login-wrapper">
	<div class="login-card">
		<h1>Opret bruger</h1>
        
        <div class="field">
			<Input bind:value={newUserName} placeholder="Nyt brugernavn" />
		</div>

		<div class="field">
			<Input bind:value={newPassword} placeholder="Ny adgangskode" type="password" />
		</div>

		<!-- 👇 TO KNAPPER VED SIDEN AF HINANDEN -->
		<div class="button-row">
			<button on:click={createUser} class="create-btn">
				Opret bruger
			</button>

			<a href="/" class="back-btn">
				Tilbage til login
			</a>
		</div>
	</div>
</div>

<style>
	.button-row {
		display: flex;
		gap: 10px;
		justify-content: center;
		margin-top: 10px;
	}

	.create-btn {
		padding: 10px 20px;
		border-radius: 8px;
		border: none;
		background-color: #2f5d50;
		color: white;
		cursor: pointer;
	}

	.create-btn:hover {
		background-color: #24463c;
	}

	.back-btn {
		padding: 10px 20px;
		border-radius: 8px;
		background-color: #ccc;
		color: black;
		text-decoration: none;
		display: flex;
		align-items: center;
	}

	.back-btn:hover {
		background-color: #bbb;
	}
</style>