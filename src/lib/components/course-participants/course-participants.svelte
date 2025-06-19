<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { type Course } from '$lib/firebase/courses';
	import type { Profile } from '$lib/firebase/profiles';
	import { getProfile } from '$lib/firebase/profiles';
	import { authState } from '$lib/state/shared.svelte';
	import { ParticipantsManager } from '$lib/components/participants-manager';
	import { Loader2Icon } from '@lucide/svelte';

	type Props = {
		course: Course;
	};
	let { course }: Props = $props();
	const currentUserId = authState.user!.uid;

	let participants = $state<Record<string, Profile | null>>({});
	let loading = $state(true);
	let error = $state<string | null>(null);

	$effect(() => {
		loadParticipants();
	});

	async function loadParticipants() {
		try {
			loading = true;
			const participantIds = Object.entries(course.participants)
				.filter(([_, isActive]) => isActive)
				.map(([id]) => id);

			const profiles = await Promise.all(
				participantIds.map(async (id) => {
					const profile = await getProfile(id);
					return [id, profile] as const;
				})
			);

			participants = Object.fromEntries(profiles);
			console.log('Participants loaded:', participants);
		} catch (e) {
			console.error('Error loading participants:', e);
			error = "Une erreur s'est produite lors du chargement des participants";
		} finally {
			loading = false;
		}
	}

	const isCreator = course.userId === currentUserId;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Participants</Card.Title>
		<Card.Description>
			{#if isCreator}
				Gérez les participants de votre cours
			{:else}
				Liste des participants au cours
			{/if}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if loading}
			<div class="flex min-h-[100px] items-center justify-center">
				<Loader2Icon class="h-6 w-6 animate-spin" />
			</div>
		{:else if error}
			<p class="text-destructive text-sm">{error}</p>
		{:else}
			<div class="space-y-4">
				{#if isCreator}
					<ParticipantsManager bind:participants courseId={course.id} />
				{/if}
				<div class="divide-y">
					{#each Object.entries(participants) as [userId, profile]}
						<div class="flex items-center justify-between py-2">
							<div class="flex items-center gap-2">
								<div>
									<p class="font-medium">
										{profile?.displayName || profile?.email || 'Utilisateur inconnu'}
									</p>
									{#if profile?.email}
										<p class="text-muted-foreground text-sm">{profile.email}</p>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
