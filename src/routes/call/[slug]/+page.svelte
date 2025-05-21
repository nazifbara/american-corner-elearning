<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Zoom from './Zoom.svelte';

	const slug = page.url.pathname.split('/')[2];

	onMount(async () => {
		if (browser) {
			const response = await fetch('/api/meeting', {
				method: 'POST',
				body: JSON.stringify({ topic: slug })
			});
			console.log(await response.json());
		}
	});
</script>

<div>
	<h1>Session: {slug}</h1>
	<!-- <Zoom /> -->
</div>
