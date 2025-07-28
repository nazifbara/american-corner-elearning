<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { getLearnerCohorts, getCoachCohorts, type Cohort } from '$lib/firebase/cohorts';
	import { ListHandler } from '$lib/state/list-handler.svelte';
	import { Loader2Icon, BoxIcon } from '@lucide/svelte';
	import { authState } from '$lib/state/shared.svelte';
	import { onMount } from 'svelte';

	const cohortsState = new ListHandler<Cohort>({});

	onMount(() => {
		if (authState.profile?.roles.includes('coach')) {
			cohortsState.fetchFn = () => getCoachCohorts(authState.profile!);
		} else if (authState.profile?.roles.includes('student')) {
			cohortsState.fetchFn = () => getLearnerCohorts(authState.profile!);
		} else {
			cohortsState.fetchFn = () => Promise.resolve([]);
		}
		cohortsState.fetch();
	});
</script>

<h1 class="text-2xl font-bold">Mes cohortes</h1>
<p class="text-muted-foreground mb-6">
	{#if authState.profile?.roles.includes('coach')}
		Liste de toutes les cohortes que vous gérez.
	{:else if authState.profile?.roles.includes('student')}
		Liste de toutes les cohortes auxquelles vous êtes inscrit(e).
	{:else}
		Aucune cohorte disponible pour votre rôle.
	{/if}
</p>

{#if cohortsState.loading}
	<div class="flex min-h-[200px] items-center justify-center">
		<Loader2Icon class="h-8 w-8 animate-spin" />
	</div>
{:else if cohortsState.error}
	<p class="text-destructive">{cohortsState.error}</p>
{:else if cohortsState.data && cohortsState.data.length > 0}
	<ul class="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(350px,0px))] gap-4">
		{#each cohortsState.data as cohort (cohort.id)}
			<li>
				<a href={`/app/cohorts/${cohort.id}`} class=" block h-[150px]">
					<Card.Root class="hover:bg-muted h-full transition-colors">
						<Card.Content class="flex h-full flex-col justify-between">
							<span class="text-xl font-semibold">Cohort {cohort.number} - {cohort.year}</span>
							<BoxIcon class="text-muted-foreground h-6 w-6" />
						</Card.Content>
					</Card.Root>
				</a>
			</li>
		{/each}
	</ul>
{:else}
	<p>Aucune cohorte trouvée.</p>
{/if}
