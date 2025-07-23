<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { getCurrentCohort, type Cohort } from '$lib/firebase/cohorts';
	import { authState } from '$lib/state/shared.svelte';
	import { EntityState } from '$lib/state/entity-state.svelte';
	import { Loader2Icon, UserIcon, PlayIcon, ClockIcon } from '@lucide/svelte';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { getProfile, type Profile } from '$lib/firebase/profiles';
	import { ListHandler } from '$lib/state/list-handler.svelte';
	import { VideoConference } from '$lib/components/video-conference';
	import { subscribeToCourse } from '$lib/firebase/courses';

	const cohortState = new EntityState<Cohort>(() => getCurrentCohort(authState.profile!));
	const coachState = new EntityState<Profile>(() => Promise.resolve(null));
	const membersState = new ListHandler<Profile>({
		fetchFn: () => {
			if (cohortState.data) {
				const memberIds = Object.keys(cohortState.data.members || {});
				return Promise.all(memberIds.map((id) => getProfile(id) as Promise<Profile>));
			}
			return Promise.resolve([]);
		}
	});

	const cohortId = page.params.cohortId;
	let unsubscribe: (() => void) | null = null;
	let allowedUserIds = $derived.by(() => {
		return [cohortState.data?.coach, ...Object.keys(cohortState.data?.members || {})];
	});

	function canJoinCourseToday(cohort: Cohort): boolean {
		if (!cohort.startDate || !cohort.schedules) return false;
		const now = new Date();
		const startDate = new Date(cohort.startDate);
		if (now < startDate) return false;
		// JS: Sunday=0, Monday=1, ...
		const today = now.getDay() === 0 ? 7 : now.getDay(); // convert Sunday(0) to 7
		const scheduleTime = cohort.schedules[today];
		if (!scheduleTime) return false;
		// scheduleTime is expected as 'HH:mm' or 'H:mm'
		const [hour, minute] = scheduleTime.split(':').map(Number);
		const startOfSession = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
		// Optionally, allow join X minutes before/after. Here, allow from 15min before to 2h after
		const joinWindowStart = new Date(startOfSession.getTime() - 15 * 60 * 1000);
		const joinWindowEnd = new Date(startOfSession.getTime() + 2 * 60 * 60 * 1000);
		return now >= joinWindowStart && now <= joinWindowEnd;
	}

	$effect(() => {
		if (cohortState.data) {
			coachState.fetchFn = () => getProfile(cohortState.data!.coach!);
			coachState.fetch();
			membersState.fetch();
		}
	});
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
					{#if coachState.loading}
						<Loader2Icon class="animate-spin" />
					{:else}
						<span>{coachState.data?.displayName ?? 'Aucun'}</span>
					{/if}
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
								class="bg-primary text-primary-foreground flex aspect-square w-20 items-center justify-center rounded-full p-2 text-xs font-medium"
								>{['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'][
									+day - 1
								]}</span
							>
							<span class="text-sm font-medium">{time}</span>
						</div>
					{/each}
				</div>
			</div>
			<Tabs.Root value="course">
				<Tabs.List>
					<Tabs.Trigger value="course">Cours</Tabs.Trigger>
					<Tabs.Trigger value="posts">Posts</Tabs.Trigger>
					<Tabs.Trigger value="exercices">Exercices</Tabs.Trigger>
					<Tabs.Trigger value="grades">Notes</Tabs.Trigger>
					<Tabs.Trigger value="members">Membres</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="course">
					<div class="space-y-4">
						<div class="grid gap-4 md:grid-cols-2">
							<Card.Root>
								<Card.Header>
									<Card.Title>Conférence vidéo</Card.Title>
									<Card.Description>Rejoignez la conférence vidéo pour ce cours</Card.Description>
								</Card.Header>
								<Card.Content>
									{#if allowedUserIds.includes(authState.user!.uid) && coachState.data && canJoinCourseToday(cohortState.data)}
										<VideoConference cohort={cohortState.data} />
									{:else if allowedUserIds.includes(authState.user!.uid) && coachState.data}
										<p class="text-muted-foreground">
											Vous ne pouvez rejoindre la conférence vidéo qu'aux horaires prévus à partir
											de la date de début du cours.
										</p>
									{:else}
										<p class="text-muted-foreground">
											Vous n'êtes pas autorisé à rejoindre cette conférence vidéo.
										</p>
									{/if}
								</Card.Content>
							</Card.Root>
						</div>
					</div>
				</Tabs.Content>
				<Tabs.Content value="posts">Liste des posts</Tabs.Content>
				<Tabs.Content value="exercices">Liste des exercices</Tabs.Content>
				<Tabs.Content value="grades">List des notes</Tabs.Content>
				<Tabs.Content value="members">
					<div>
						<h2 class="mb-2 text-lg font-semibold">Membres</h2>
						{#if membersState.loading}
							<Loader2Icon size={20} class="animate-spin" />
						{:else if membersState.error}
							<p class="text-destructive">{membersState.error}</p>
						{:else if membersState.data.length === 0}
							<p>Aucun membre trouvé.</p>
						{:else}
							<ul class="list-disc pl-6">
								{#each membersState.data as member}
									<li>{member.displayName}</li>
								{/each}
							</ul>
						{/if}
					</div>
				</Tabs.Content>
			</Tabs.Root>
		</Card.Content>
	</Card.Root>
{/if}
