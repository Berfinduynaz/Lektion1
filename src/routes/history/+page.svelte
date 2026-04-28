 <script>
	import { goto } from '$app/navigation';

	let userId = $state('');
	let measurements = $state([]);
	let loading = $state(true);

	$effect(() => {
		userId = localStorage.getItem('userId');

		if (!userId) {
			goto('/');
			return;
		}

		loadHistory();
	});

	async function loadHistory() {
		const response = await fetch(`/api/measurements?userId=${userId}&days=365`);
		measurements = await response.json();
		loading = false;
	}

	function goBack() {
		goto('/dashboard');
	}
</script>

<div class="history-container">
	<h1>Min historik</h1>
	<p>Her kan du se dine tidligere registreringer.</p>

	<button class="back-btn" on:click={goBack}>Tilbage til dashboard</button>

	{#if loading}
		<p>Indlæser historik...</p>
	{:else if measurements.length === 0}
		<p>Der er endnu ingen gemte målinger.</p>
	{:else}
		<table>
			<thead>
				<tr>
					<th>Dato</th>
					<th>Åndenød</th>
					<th>Hoste</th>
					<th>Slimmængde</th>
					<th>Slimfarve</th>
					<th>Temp.</th>
					<th>Puls</th>
					<th>Ilt</th>
				</tr>
			</thead>
			<tbody>
				{#each measurements as m}
					<tr>
						<td>{new Date(m.createdAt).toLocaleDateString('da-DK')}</td>
						<td>{m.shortnessOfBreath}</td>
						<td>{m.cough}</td>
						<td>{m.phlegmAmount}</td>
						<td>{m.phlegmColor}</td>
						<td>{m.temperature}°C</td>
						<td>{m.pulse}</td>
						<td>{m.oxygen}%</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
	.history-container {
		max-width: 1000px;
		margin: 40px auto;
		padding: 20px;
	}

	h1 {
		color: #174633;
	}

	.back-btn {
		margin: 20px 0;
		padding: 12px 18px;
		border: none;
		border-radius: 10px;
		background: #174633;
		color: white;
		font-weight: 700;
		cursor: pointer;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 20px;
		background: white;
	}

	th,
	td {
		border: 1px solid #ddd;
		padding: 10px;
		text-align: left;
	}

	th {
		background: #e8f3ed;
		color: #174633;
	}

	tr:nth-child(even) {
		background: #f7f7f7;
	}
</style>