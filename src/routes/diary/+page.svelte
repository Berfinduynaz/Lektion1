<script>
	import { onMount } from 'svelte';

	let posts = $state([]);
	let title = $state('');
	let content = $state('');

	async function loadPosts() {
		const res = await fetch('/api/diary/self');
		posts = await res.json();
	}

	async function createPost() {
		await fetch('/api/diary/self', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title, content })
		});

		title = '';
		content = '';
		await loadPosts();
	}

	onMount(() => {
		loadPosts();
	});
</script>

<h1>Dagbog</h1>

<input placeholder="Titel" bind:value={title} />
<br /><br />

<textarea placeholder="Indhold" bind:value={content}></textarea>
<br /><br />

<button onclick={createPost}>Gem</button>

<h2>Dine opslag</h2>

{#each posts as post}
	<div style="margin-bottom: 10px;">
		<h3>{post.title}</h3>
		<p>{post.content}</p>
	</div>
{/each}