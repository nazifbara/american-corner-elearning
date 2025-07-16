<script lang="ts">
	import { authState } from '$lib/state/shared.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();
	let autorized = $state(false);

	$effect(() => {
		if (authState.profile && authState.profile.roles.includes('admin')) {
			autorized = true;
		}
	});
</script>

{#if autorized}
	{@render children()}
{:else}
	<p class="text-destructive text-center">Vous n'êtes pas autorisé à voir cette page.</p>
{/if}
