<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { DataTable } from '$lib/components/ui/data-table';
	import { PlusIcon, Loader2Icon, RotateCcwIcon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import { getCohorts, countCohortsByYear, addCohort, type Cohort } from '$lib/firebase/cohorts';
	import { onMount } from 'svelte';
	import { columns } from './columns';
	import { coachList } from '$lib/state/shared.svelte';
	import { ListHandler } from '$lib/state/list-handler.svelte';

	const cohortList = new ListHandler<Cohort>({
		fetchFn: getCohorts,
		addFn: async () => {
			const year = new Date().getFullYear();

			const count = await countCohortsByYear(year);
			const newCohort = await addCohort({ year, number: count + 1 });
			return newCohort;
		}
	});

	onMount(() => {
		cohortList.fetch();
		coachList.fetch();
	});
</script>

<div class="mb-4 flex justify-between">
	<h1 class="text-2xl font-semibold">Cohortes</h1>
	<Button
		size="sm"
		onclick={() =>
			cohortList.add({
				onSuccess: () => toast.success('Cohorte créée avec succès'),
				onError: () => toast.error('Une erreur est survenue lors de la création de la cohorte.')
			})}
		disabled={cohortList.adding}
	>
		{#if cohortList.adding}
			<Loader2Icon class="mr-2 h-4 w-4 animate-spin" />
		{:else}
			<PlusIcon class="mr-2" />
		{/if}
		Créer une cohorte
	</Button>
</div>

{#if cohortList.loading || coachList.loading}
	<div class="flex min-h-[200px] items-center justify-center">
		<Loader2Icon class="h-8 w-8 animate-spin" />
	</div>
{:else if cohortList.error}
	<div class="flex min-h-[200px] flex-col items-center justify-center">
		<div class="text-destructive text-center">{cohortList.error}</div>
		<Button variant="outline" onclick={() => cohortList.fetch()} class="mt-2">
			<RotateCcwIcon class="mr-2" />
			Réessayer
		</Button>
	</div>
{:else if cohortList.data.length === 0}
	<div class="text-muted-foreground text-center">Aucune cohorte trouvée.</div>
{:else}
	{#key cohortList.data.length}
		<div class="mx-auto w-full max-w-2xl">
			<DataTable data={cohortList.data} {columns} />
		</div>
	{/key}
{/if}
