<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Accordion from '$lib/components/ui/accordion';
	import { PlusIcon } from '@lucide/svelte';
	import { getCohorts } from '$lib/firebase/cohorts';
	import { onMount } from 'svelte';
	import { groupCohortsByYear } from '$lib/utils';
	import type { Cohort } from '$lib/firebase/cohorts';

	let groupedCohorts: [number, Cohort[]][] = $state([]);

	onMount(async () => {
		const cohorts = await getCohorts();
		groupedCohorts = groupCohortsByYear(cohorts);
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

<Accordion.Root type="single" class="mx-auto w-full max-w-sm">
	{#each groupedCohorts as [year, cohorts]}
		<Accordion.Item value={year.toString()} class="mb-2">
			<Accordion.Trigger class="w-full text-left">
				Cohortes de {year}
			</Accordion.Trigger>
			<Accordion.Content>
				<ul class="list-disc pl-6">
					{#each cohorts as cohort}
						<li>Cohorte {cohort.number} - {year}</li>
					{/each}
				</ul>
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
