<script>
	import { goto } from '$app/navigation';

	let shortnessOfBreath = $state('');
	let cough = $state('');
	let phlegmAmount = $state('');
	let phlegmColor = $state('');
	let temperature = $state('');
	let pulse = $state('');
	let oxygen = $state('');

	let feedbackMessage = $state('');
	let feedbackType = $state('');
	let showPopup = $state(false);

	let userId = $state('');

	$effect(() => {
		userId = localStorage.getItem('userId');

		if (!userId) {
			goto('/');
		}
	});

	function amountToNumber(amount) {
		if (amount === 'lav') return 1;
		if (amount === 'moderat') return 2;
		if (amount === 'høj') return 3;
		return 0;
	}

	function average(values) {
		if (!values.length) return 0;
		return values.reduce((sum, value) => sum + value, 0) / values.length;
	}

	async function saveData() {
		const sob = Number(shortnessOfBreath);
		const coughValue = Number(cough);
		const temp = Math.round(Number(temperature));
		const pulseValue = Number(pulse);
		const oxygenValue = Number(oxygen);

		if (
			!shortnessOfBreath ||
			!cough ||
			!phlegmAmount ||
			!phlegmColor ||
			!temperature ||
			!pulse ||
			!oxygen
		) {
			feedbackType = 'yellow';
			feedbackMessage = 'Udfyld alle felter før du gemmer.';
			showPopup = false;
			return;
		}

		try {
			await fetch('/api/measurements', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId,
					shortnessOfBreath: sob,
					cough: coughValue,
					phlegmAmount,
					phlegmColor,
					temperature: temp,
					pulse: pulseValue,
					oxygen: oxygenValue,
					createdAt: new Date().toISOString()
				})
			});

			const response = await fetch(`/api/measurements?userId=${userId}&days=14`);

			if (!response.ok) {
				feedbackType = 'yellow';
				feedbackMessage =
					'Målingen blev gemt, men systemet kunne ikke hente tidligere målinger endnu.';
				showPopup = false;
				return;
			}

			const history = await response.json();

			let redFlag = false;
			let yellowFlag = false;

			if (!history || history.length < 2) {
				feedbackType = 'green';
				feedbackMessage =
					'Din måling er gemt. Systemet skal bruge flere registreringer over flere dage for at kunne vurdere forværring.';
				showPopup = false;
				return;
			}

			const previousMeasurements = history.slice(0, -1);

			const avgSob = average(previousMeasurements.map((m) => Number(m.shortnessOfBreath)));
			const avgCough = average(previousMeasurements.map((m) => Number(m.cough)));
			const avgTemp = average(previousMeasurements.map((m) => Number(m.temperature)));
			const avgPulse = average(previousMeasurements.map((m) => Number(m.pulse)));
			const avgOxygen = average(previousMeasurements.map((m) => Number(m.oxygen)));
			const avgPhlegmAmount = average(
				previousMeasurements.map((m) => amountToNumber(m.phlegmAmount))
			);

			const sobWorsened = sob >= avgSob + 1;
			const coughWorsened = coughValue >= avgCough + 1;
			const tempWorsened = temp >= avgTemp + 0.5;
			const pulseWorsened = pulseValue >= avgPulse + 10;
			const oxygenDropped = oxygenValue <= avgOxygen - 2;
			const phlegmAmountWorsened = amountToNumber(phlegmAmount) > avgPhlegmAmount;

			const hadClearBefore = previousMeasurements.some((m) => m.phlegmColor === 'klar');
			const hadNotGreenBefore = previousMeasurements.some((m) => m.phlegmColor !== 'grøn');

			const phlegmColorWorsened =
				(phlegmColor === 'gul' && hadClearBefore) ||
				(phlegmColor === 'grøn' && hadNotGreenBefore);

			const worseningCount =
				(sobWorsened ? 1 : 0) +
				(coughWorsened ? 1 : 0) +
				(tempWorsened ? 1 : 0) +
				(pulseWorsened ? 1 : 0) +
				(oxygenDropped ? 1 : 0) +
				(phlegmAmountWorsened ? 1 : 0) +
				(phlegmColorWorsened ? 1 : 0);

			if (worseningCount >= 3) {
				redFlag = true;
			} else if (worseningCount >= 1) {
				yellowFlag = true;
			}

			if (redFlag) {
				feedbackType = 'red';
				feedbackMessage =
					'Dine registreringer tyder på, at dine symptomer er blevet værre i forhold til dine tidligere målinger. Kontakt egen læge eller relevant sundhedspersonale.';
			} else if (yellowFlag) {
				feedbackType = 'yellow';
				feedbackMessage =
					'Dine registreringer viser begyndende ændringer i forhold til dine tidligere målinger. Hold ekstra øje med dine symptomer og registrer igen i morgen.';
			} else {
				feedbackType = 'green';
				feedbackMessage =
					'Dine registreringer ser stabile ud i forhold til dine tidligere målinger.';
			}

			showPopup = false;
		} catch (error) {
			feedbackType = 'yellow';
			feedbackMessage = 'Der opstod en fejl ved gemning eller hentning af målinger.';
			showPopup = false;
			console.error(error);
		}
	}

	function openFeedback() {
		if (feedbackMessage) {
			showPopup = true;
		}
	}

	function closeFeedback() {
		showPopup = false;
	}

	function logout() {
		window.location.href = '/';
	}
</script>

<div class="dashboard-container">
	<h1>KOL Dashboard</h1>
	<p>Indtast dagens symptomer og målinger</p>

	<div class="dashboard">
		<div class="field">
			<label>Åndenød (1-5)</label>
			<input type="number" min="1" max="5" bind:value={shortnessOfBreath} />
		</div>

		<div class="field">
			<label>Hoste (1-5)</label>
			<input type="number" min="1" max="5" bind:value={cough} />
		</div>

		<div class="field">
			<label>Slimmængde</label>
			<select bind:value={phlegmAmount}>
				<option value="">Vælg</option>
				<option value="lav">Lav</option>
				<option value="moderat">Moderat</option>
				<option value="høj">Høj</option>
			</select>
		</div>

		<div class="field">
			<label>Slimfarve</label>
			<select bind:value={phlegmColor}>
				<option value="">Vælg</option>
				<option value="klar">Klar</option>
				<option value="gul">Gul</option>
				<option value="grøn">Grøn</option>
			</select>
		</div>

		<div class="field">
			<label>Temperatur (°C)</label>
			<input type="number" step="0.1" bind:value={temperature} />
		</div>

		<div class="field">
			<label>Puls</label>
			<input type="number" bind:value={pulse} />
		</div>

		<div class="field">
			<label>Iltmætning (%)</label>
			<input type="number" bind:value={oxygen} />
		</div>

		<div class="action-row">
			<button class="save-btn" on:click={saveData}>Gem værdier</button>

			<button class="history-btn" on:click={() => goto('/history')}>
				Se historik
			</button>

			{#if feedbackMessage}
				<button class="feedback-trigger {feedbackType}" on:click={openFeedback}>
					Se feedback
				</button>
			{/if}
		</div>
	</div>
</div>

<button class="logout-btn" on:click={logout}>
	Log ud
</button>

{#if showPopup}
	<div class="overlay" on:click={closeFeedback}>
		<div class="popup {feedbackType}" on:click={(e) => e.stopPropagation()}>
			<div class="popup-header">
				<h3>Systemets vurdering</h3>
				<button class="close-btn" on:click={closeFeedback}>×</button>
			</div>
			<p>{feedbackMessage}</p>
		</div>
	</div>
{/if}

<style>
	.dashboard-container {
		max-width: 900px;
		margin-left: 120px;
		margin-right: auto;
		padding-top: 40px;
		padding-bottom: 40px;
	}

	h1 {
		margin-bottom: 10px;
	}

	p {
		margin-bottom: 24px;
		color: #555;
	}

	.dashboard {
		max-width: 700px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	label {
		font-weight: 600;
	}

	input,
	select {
		padding: 12px;
		border: 1px solid #ccc;
		border-radius: 10px;
		font-size: 16px;
	}

	.action-row {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-top: 8px;
		flex-wrap: wrap;
	}

	.save-btn {
		width: 180px;
		padding: 14px;
		border: none;
		border-radius: 12px;
		background: #16a34a;
		color: white;
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;
	}

	.save-btn:hover {
		background: #15803d;
	}

	.history-btn {
		width: 180px;
		padding: 14px;
		border: none;
		border-radius: 12px;
		background: #174633;
		color: white;
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;
	}

	.history-btn:hover {
		background: #0f2f22;
	}

	.feedback-trigger {
		padding: 14px 20px;
		border-radius: 12px;
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;
		border: 1px solid transparent;
		min-width: 180px;
	}

	.feedback-trigger.green {
		background: #dcfce7;
		color: #166534;
		border-color: #86efac;
	}

	.feedback-trigger.yellow {
		background: #fef9c3;
		color: #854d0e;
		border-color: #fde68a;
	}

	.feedback-trigger.red {
		background: #fee2e2;
		color: #991b1b;
		border-color: #fca5a5;
	}

	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.35);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		z-index: 1000;
	}

	.popup {
		width: min(520px, 90vw);
		border-radius: 16px;
		padding: 22px;
		box-shadow: 0 18px 50px rgba(0, 0, 0, 0.2);
		border: 1px solid transparent;
	}

	.popup.green {
		background: #dcfce7;
		color: #166534;
		border-color: #86efac;
	}

	.popup.yellow {
		background: #fef9c3;
		color: #854d0e;
		border-color: #fde68a;
	}

	.popup.red {
		background: #fee2e2;
		color: #991b1b;
		border-color: #fca5a5;
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}

	.popup-header h3 {
		margin: 0;
		font-size: 22px;
	}

	.popup p {
		margin: 0;
		font-size: 17px;
		line-height: 1.5;
		color: inherit;
	}

	.close-btn {
		background: transparent;
		border: none;
		font-size: 28px;
		font-weight: 700;
		cursor: pointer;
		color: inherit;
		line-height: 1;
		padding: 0;
	}

	.logout-btn {
		position: fixed;
		right: 20px;
		bottom: 20px;
		background: #dc2626;
		color: white;
		border: none;
		padding: 12px 18px;
		border-radius: 10px;
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
		z-index: 1100;
	}

	.logout-btn:hover {
		background: #b91c1c;
	}

	@media (max-width: 700px) {
		.dashboard-container {
			margin-left: 20px;
			margin-right: 20px;
		}

		.action-row {
			flex-direction: column;
			align-items: stretch;
		}

		.save-btn,
		.history-btn,
		.feedback-trigger {
			width: 100%;
		}
	}
</style>