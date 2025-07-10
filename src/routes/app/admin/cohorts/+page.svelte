<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { DataTable } from '$lib/components/ui/data-table';
	import { PlusIcon, Loader2Icon, RotateCcwIcon } from '@lucide/svelte';

	import { getCohorts, countCohortsByYear, addCohort } from '$lib/firebase/cohorts';
	import { onMount } from 'svelte';
	import type { Cohort } from '$lib/firebase/cohorts';
	import { columns } from './columns';
	import { toast } from 'svelte-sonner';
	import { coachList } from '$lib/state/shared.svelte';

	let cohorts: Cohort[] = $state([]);
	let loading = $state(false);
	let addingCohort = $state(false);
	let error: string | null = $state(null);

	onMount(() => {
		fetchCohorts();
		coachList.fetch();
	});

	async function handleNewCohort() {
		if (addingCohort) return;

		try {
			addingCohort = true;
			const year = new Date().getFullYear();
			const count = await countCohortsByYear(year);
			const newCohort = await addCohort({ year, number: count + 1 });
			cohorts.splice(0, 0, newCohort);
			toast.success('Cohorte créée avec succès');
		} catch (e) {
			console.error('Error creating cohort:', e);
			toast.error('Une erreur est survenue lors de la création de la cohorte.');
		} finally {
			addingCohort = false;
		}
	}

	async function fetchCohorts() {
		try {
			loading = true;
			cohorts = await getCohorts();
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
	<Button size="sm" onclick={handleNewCohort} disabled={addingCohort}>
		{#if addingCohort}
			<Loader2Icon class="mr-2 h-4 w-4 animate-spin" />
		{:else}
			<PlusIcon class="mr-2" />
		{/if}
		Créer une cohorte
	</Button>
</div>

{#if loading || coachList.loading}
	<div class="flex min-h-[200px] items-center justify-center">
		<Loader2Icon class="h-8 w-8 animate-spin" />
	</div>
{:else if error}
	<div class="flex min-h-[200px] flex-col items-center justify-center">
		<div class="text-destructive text-center">{error}</div>
		<Button variant="outline" onclick={fetchCohorts} class="mt-2">
			<RotateCcwIcon class="mr-2" />
			Réessayer
		</Button>
	</div>
{:else if cohorts.length === 0}
	<div class="text-muted-foreground text-center">Aucune cohorte trouvée.</div>
{:else}
	{#key cohorts.length}
		<div class="mx-auto w-full max-w-2xl">
			<DataTable data={cohorts} {columns} />
		</div>
	{/key}
{/if}
