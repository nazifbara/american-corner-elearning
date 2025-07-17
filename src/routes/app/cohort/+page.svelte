<script lang="ts">
	import { onMount } from 'svelte';
	import { getCurrentCohort, type Cohort } from '$lib/firebase/cohorts';
	import { authState } from '$lib/state/shared.svelte';

	let cohort: Cohort | null = $state(null);

	onMount(() => {
		getCurrentCohort(authState.profile!).then((c) => (cohort = c));
	});
</script>

<h1>Cohorte de l'utilisateur</h1>
{cohort}
