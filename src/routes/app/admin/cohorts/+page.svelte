<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { DataTable } from '$lib/components/ui/data-table';
	import { PlusIcon, Loader2Icon, RotateCcwIcon } from '@lucide/svelte';
	import { getCohorts } from '$lib/firebase/cohorts';
	import { onMount } from 'svelte';
	import type { Cohort } from '$lib/firebase/cohorts';
	import { columns } from './columns';

	let cohorts: Cohort[] = $state([]);
	let loading = $state(false);
	let error: string | null = $state(null);

	onMount(() => {
		fetchCohorts();
	});

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
	<div class="mx-auto w-full max-w-2xl">
		<DataTable data={cohorts} {columns} />
	</div>
{/if}
