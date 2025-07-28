<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getCohort, type Cohort } from '$lib/firebase/cohorts';
	import { EntityState } from '$lib/state/entity-state.svelte';
	import { Loader2Icon, PresentationIcon, PlayIcon, ClockIcon, ArrowLeft } from '@lucide/svelte';
	import { authState } from '$lib/state/shared.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { getProfile, type Profile } from '$lib/firebase/profiles';
	import { ListHandler } from '$lib/state/list-handler.svelte';
	import { VideoConference } from '$lib/components/video-conference';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import Button from '$lib/components/ui/button/button.svelte';
	dayjs.extend(duration);

	const cohortId = page.params.cohortId;
	const cohortState = new EntityState<Cohort>(() => getCohort(cohortId));
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

	let allowedUserIds = $derived.by(() => {
		return [cohortState.data?.coach, ...Object.keys(cohortState.data?.members || {})];
	});

	function getJoinWindow(cohort: Cohort) {
		if (!cohort.startDate || !cohort.schedules) return null;
		const now = dayjs();
		const startDate = dayjs(cohort.startDate);
		if (now.isBefore(startDate, 'day')) return null;
		const today = now.day() === 0 ? 7 : now.day();
		const scheduleTime = cohort.schedules[today];
		if (!scheduleTime) return null;
		const [hour, minute] = scheduleTime.split(':').map(Number);
		const startOfSession = now.hour(hour).minute(minute).second(0).millisecond(0);
		const joinWindowStart = startOfSession.subtract(15, 'minute');
		const joinWindowEnd = startOfSession.add(2, 'hour');
		return { joinWindowStart, joinWindowEnd };
	}

	function canJoinCourseToday(cohort: Cohort): boolean {
		const window = getJoinWindow(cohort);
		if (!window) return false;
		const now = dayjs();
		return now.isAfter(window.joinWindowStart) && now.isBefore(window.joinWindowEnd);
	}

	let countdown = $state('');
	let countdownInterval: any = null;

	function startCountdown(cohort: Cohort) {
		stopCountdown();
		const window = getJoinWindow(cohort);
		if (!window) return;
		const now = dayjs();
		let target: dayjs.Dayjs;
		if (now.isBefore(window.joinWindowStart)) {
			target = window.joinWindowStart;
		} else if (now.isAfter(window.joinWindowEnd)) {
			countdown = 'Session terminée';
			return;
		} else {
			countdown = '';
			return;
		}
		updateCountdown(target);
		countdownInterval = setInterval(() => updateCountdown(target), 1000);
	}

	function stopCountdown() {
		if (countdownInterval) {
			clearInterval(countdownInterval);
			countdownInterval = null;
		}
	}

	function updateCountdown(target: dayjs.Dayjs) {
		const now = dayjs();
		const diff = target.diff(now);
		if (diff <= 0) {
			countdown = 'ouvert';
			stopCountdown();
			return;
		}
		const duration = dayjs.duration(diff);
		const hours = String(Math.floor(duration.asHours())).padStart(2, '0');
		const minutes = String(duration.minutes()).padStart(2, '0');
		const seconds = String(duration.seconds()).padStart(2, '0');
		countdown = `${hours}:${minutes}:${seconds}`;
	}

	$effect(() => {
		if (cohortState.data && !canJoinCourseToday(cohortState.data)) {
			startCountdown(cohortState.data);
		} else {
			stopCountdown();
			countdown = '';
		}
	});

	onDestroy(() => {
		stopCountdown();
	});

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
{:else if !cohortState.data || !allowedUserIds.includes(authState.profile!.uid)}
	<p class="text-destructive">Cohorte non trouvée.</p>
{:else}
	<div class="mx-auto grid max-w-4xl gap-4">
		<Button size="sm" href="/app/cohorts" variant="outline" class="justify-self-start">
			<ArrowLeft />
			Retour à la liste des cohortes</Button
		>
		<Card.Root class="grid  gap-6">
			<Card.Header>
				<Card.Title class="text-3xl font-normal"
					>Cohorte {cohortState.data.number} - {cohortState.data.year}</Card.Title
				>
				<Card.Description class="grid grid-cols-[repeat(3,auto)] items-center justify-start gap-2">
					<div class="flex items-center gap-2">
						<PresentationIcon size={20} />
						{#if coachState.loading}
							<Loader2Icon size={20} class="animate-spin" />
						{:else}
							<span>{coachState.data?.displayName ?? 'Aucun'}</span>
						{/if}
					</div>
					<Separator orientation="vertical" />
					<div class="flex items-center gap-2">
						<PlayIcon size={20} />
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
			</Card.Content>
		</Card.Root>

		<Tabs.Root value="course" class="gap-4">
			<Tabs.List class="w-full">
				<Tabs.Trigger value="course">Cours</Tabs.Trigger>
				<Tabs.Trigger value="posts">Posts</Tabs.Trigger>
				<Tabs.Trigger value="exercices">Exercices</Tabs.Trigger>
				<Tabs.Trigger value="grades">Notes</Tabs.Trigger>
				<Tabs.Trigger value="members">Membres</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="course">
				<div class="mb-2">
					<h2 class="text-xl font-semibold">Conférence vidéo</h2>
					<p class="text-muted-foreground">Rejoignez la conférence vidéo de cette cohorte</p>
				</div>

				{#if canJoinCourseToday(cohortState.data)}
					<VideoConference cohort={cohortState.data} />
				{:else if countdown && countdown === 'Session terminée'}
					<p class="text-lg font-semibold">Le cours d'aujourd'hui est terminé</p>
				{:else if countdown === 'ouvert'}
					<VideoConference cohort={cohortState.data} />
				{:else if countdown}
					<p class="text-lg font-semibold">
						{countdown === 'Session terminée'
							? "Le cours d'aujourd'hui est terminé"
							: `Début du cours dans : ${countdown}`}
					</p>
				{:else}
					<p>
						Vous ne pouvez rejoindre la conférence vidéo qu'aux horaires prévus à partir de la date
						de début du cours.
					</p>
				{/if}
			</Tabs.Content>
			<Tabs.Content value="resources">Liste des ressources</Tabs.Content>
			<Tabs.Content value="exercices">Liste des exercices</Tabs.Content>
			<Tabs.Content value="grades">List des notes</Tabs.Content>
			<Tabs.Content value="members">
				<div>
					<h2 class="mb-2 text-xl font-semibold">Membres</h2>
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
	</div>
{/if}
