<script lang="ts">
	import { getCurrentCohort, type Cohort } from '$lib/firebase/cohorts';
	import { authState } from '$lib/state/shared.svelte';
	import { EntityState } from '$lib/state/entity-state.svelte';
	import { Loader2Icon, UserIcon, PlayIcon, ClockIcon } from '@lucide/svelte';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';

	const cohortState = new EntityState<Cohort>(() => getCurrentCohort(authState.profile!));
</script>

{#if cohortState.loading}
	<div class="flex min-h-[200px] items-center justify-center">
		<Loader2Icon class="h-8 w-8 animate-spin" />
	</div>
{:else if cohortState.error}
	<p class="text-destructive">{cohortState.error}</p>
{:else if cohortState.data}
	<Card.Root class="mx-auto grid max-w-4xl gap-6">
		<Card.Header>
			<Card.Title class="text-3xl font-normal"
				>Cohorte {cohortState.data.number} - {cohortState.data.year}</Card.Title
			>
			<Card.Description class="grid grid-cols-[repeat(3,auto)] items-center justify-start gap-2">
				<div class="flex items-center gap-2">
					<UserIcon />
					<span>{cohortState.data.coach ?? 'Aucun'}</span>
				</div>
				<Separator orientation="vertical" />
				<div class="flex items-center gap-2">
					<PlayIcon />
					<span
						>{cohortState.data.startDate
							? new Date(cohortState.data.startDate).toLocaleDateString('fr-FR')
							: 'Non définie'}</span
					>
				</div>
			</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div>
				<h2 class="mb-2 flex items-center gap-2 text-sm font-semibold">
					<ClockIcon size={20} /> Horaires
				</h2>
				<div class="flex gap-4">
					{#each Object.entries(cohortState.data.schedules).filter( ([__, time]) => Boolean(time) ) as [day, time]}
						<div class="flex flex-col items-center gap-2">
							<span
								class="bg-primary text-primary-foreground flex aspect-square items-center rounded-full p-2 text-xs font-medium"
								>{['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'][
									+day - 1
								]}</span
							>
							<span class="text-sm font-medium">{time}</span>
						</div>
					{/each}
				</div>
			</div>
			<Tabs.Root value="members">
				<Tabs.List>
					<Tabs.Trigger value="course">Cours</Tabs.Trigger>
					<Tabs.Trigger value="posts">Posts</Tabs.Trigger>
					<Tabs.Trigger value="exercices">Exercices</Tabs.Trigger>
					<Tabs.Trigger value="grades">Notes</Tabs.Trigger>
					<Tabs.Trigger value="members">Membres</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="course">Cours</Tabs.Content>
				<Tabs.Content value="posts">Liste des posts</Tabs.Content>
				<Tabs.Content value="exercices">Liste des exercices</Tabs.Content>
				<Tabs.Content value="grades">List des notes</Tabs.Content>
				<Tabs.Content value="members">
					<div>
						<h2 class="mb-2 text-lg font-semibold">Membres</h2>
						<div>
							{#if cohortState.data.members && Object.keys(cohortState.data.members).length > 0}
								<ul class="ml-6 list-disc">
									{#each Object.keys(cohortState.data.members) as memberId}
										<li>{memberId}</li>
									{/each}
								</ul>
							{:else}
								<span>Aucun membre</span>
							{/if}
						</div>
					</div>
				</Tabs.Content>
			</Tabs.Root>
		</Card.Content>
	</Card.Root>
{/if}
