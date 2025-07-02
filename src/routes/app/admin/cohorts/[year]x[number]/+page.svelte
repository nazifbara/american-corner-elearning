<script lang="ts">
	import { getCohort } from '$lib/firebase/cohorts';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	onMount(() => {
		fetchCohort();
	});

	async function fetchCohort() {
		try {
			const cohort = await getCohort({
				year: Number(page.params.year),
				number: Number(page.params.number)
			});
			console.log(cohort);
		} catch (e) {
			console.error('Error fetching cohort:', e);
		}
	}
</script>

<h1>Cohort Page</h1>
