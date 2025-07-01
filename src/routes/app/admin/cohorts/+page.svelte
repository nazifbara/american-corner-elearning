<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { PlusIcon } from '@lucide/svelte';
	import { getCohorts } from '$lib/firebase/cohorts';
	import { onMount } from 'svelte';
	import { groupCohortsByYear } from '$lib/utils';

	onMount(async () => {
		const cohorts = await getCohorts();
		const groupedCohorts = groupCohortsByYear(cohorts);
		console.log(groupedCohorts);
	});
</script>

<div class="mb-4 flex justify-between">
	<h1 class="text-2xl font-semibold">Cohortes</h1>
	<Button size="sm">
		<PlusIcon class="mr-2" />
		Créer une cohorte
	</Button>
</div>

<p>Hello there!</p>
