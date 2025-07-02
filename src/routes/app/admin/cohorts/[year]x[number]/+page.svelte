<script lang="ts">
	import { getCohort, type Cohort } from '$lib/firebase/cohorts';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let cohort: Cohort | null = $state(null);

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
		}
	}
</script>

<h1 class="text-2xl">Cohort {cohort?.number} - {cohort?.year}</h1>
