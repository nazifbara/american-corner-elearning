<script lang="ts">
	import { onMount } from 'svelte';
	import { getCurrentCohort, type Cohort } from '$lib/firebase/cohorts';
	import { authState } from '$lib/state/shared.svelte';
	import { CohortState } from './cohort.svelte';
	import { Loader2Icon } from '@lucide/svelte';

	const cohortState = new CohortState(() => getCurrentCohort(authState.profile!));
</script>

<h1>Cohorte de l'utilisateur</h1>
{#if cohortState.loading}
	<div class="flex min-h-[200px] items-center justify-center">
		<Loader2Icon class="h-8 w-8 animate-spin" />
	</div>
{:else if cohortState.error}
	<p class="text-destructive">{cohortState.error}</p>
{:else}
	{cohortState.data?.number}
{/if}
