<script lang="ls">
	import { authState } from '$lib/state/shared.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		if (authState.user) {
			window.location.href = '/app';
		}
	});

	const { children } = $props();
</script>

{@render children?.()}
