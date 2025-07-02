<script lang="ts">
	import { getCohort, type Cohort } from '$lib/firebase/cohorts';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { Loader2Icon } from '@lucide/svelte';

	let cohort: Cohort | null = $state(null);
	let loading = $state(true);

	onMount(() => {
		fetchCohort();
	});

	async function fetchCohort() {
		try {
			cohort = await getCohort({
				year: Number(page.params.year),
				number: Number(page.params.number)
			});
		} catch (e) {
			console.error('Error fetching cohort:', e);
		} finally {
			loading = false;
		}
	}
</script>

{#if loading}
	<div class="flex min-h-[200px] items-center justify-center">
		<Loader2Icon class="h-8 w-8 animate-spin" />
	</div>
{:else if cohort}
	<div class="container mx-auto p-4">
		<h1 class="mb-4 text-2xl font-semibold">Cohorte {cohort.number} - {cohort.year}</h1>
	</div>
{:else}
	<div class="container mx-auto p-4">
		<p class="text-destructive">Cohorte non trouvée.</p>
	</div>
{/if}
