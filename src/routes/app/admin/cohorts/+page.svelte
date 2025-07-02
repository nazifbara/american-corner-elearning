<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Accordion from '$lib/components/ui/accordion';
	import { PlusIcon, Loader2Icon } from '@lucide/svelte';
	import { getCohorts } from '$lib/firebase/cohorts';
	import { onMount } from 'svelte';
	import { groupCohortsByYear } from '$lib/utils';
	import type { Cohort } from '$lib/firebase/cohorts';

	let groupedCohorts: [number, Cohort[]][] = $state([]);
	let loading = $state(true);
	let error: string | null = $state(null);

	onMount(async () => {
		fetchCohorts();
	});

	async function fetchCohorts() {
		try {
			loading = true;
			const cohorts = await getCohorts();
			groupedCohorts = groupCohortsByYear(cohorts);
		} catch (e) {
			console.error('Error fetching cohorts:', e);
			error = 'Une erreur est survenue lors de la récupération des cohortes.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="mb-4 flex justify-between">
	<h1 class="text-2xl font-semibold">Cohortes</h1>
	<Button size="sm">
		<PlusIcon class="mr-2" />
		Créer une cohorte
	</Button>
</div>

{#if loading}
	<div class="flex min-h-[200px] items-center justify-center">
		<Loader2Icon class="h-8 w-8 animate-spin" />
	</div>
{:else if error}
	<div class="text-destructive text-center">{error}</div>
{:else if groupedCohorts.length === 0}
	<div class="text-muted-foreground text-center">Aucune cohorte trouvée.</div>
{:else}
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
{/if}
