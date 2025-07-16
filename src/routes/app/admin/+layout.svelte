<script lang="ts">
	import { checkAdmin } from '$lib/state/shared.svelte';

	let { children } = $props();
</script>

{#if checkAdmin()}
	{@render children()}
{:else}
	<p class="text-destructive text-center">Vous n'êtes pas autorisé à voir cette page.</p>
{/if}
