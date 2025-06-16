<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { addParticipant, removeParticipant, type Course } from '$lib/firebase/courses';
	import type { Profile } from '$lib/firebase/profiles';
	import { getProfile } from '$lib/firebase/profiles';
	import { authState } from '$lib/state/shared.svelte';
	import { ParticipantsManager } from '$lib/components/participants-manager';
	import { Loader2Icon, UserIcon, UserMinusIcon, UserPlusIcon } from '@lucide/svelte';

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
		} catch (e) {
			console.error('Error loading participants:', e);
			error = "Une erreur s'est produite lors du chargement des participants";
		} finally {
			loading = false;
		}
	}

	async function handleAddParticipant(userId: string) {
		try {
			await addParticipant(course.id, userId);
			course.participants[userId] = true;
			const profile = await getProfile(userId);
			participants[userId] = profile;
		} catch (e) {
			console.error('Error adding participant:', e);
			error = "Une erreur s'est produite lors de l'ajout du participant";
		}
	}

	async function handleRemoveParticipant(userId: string) {
		try {
			await removeParticipant(course.id, userId);
			delete course.participants[userId];
			delete participants[userId];
		} catch (e) {
			console.error('Error removing participant:', e);
			error = "Une erreur s'est produite lors de la suppression du participant";
		}
	}

	const isCreator = course.userId === currentUserId;
	const isParticipant = course.participants[currentUserId] === true;
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
			{#if isCreator}
				<ParticipantsManager {participants} onAddParticipant={handleAddParticipant} />
			{/if}

			<div class="space-y-4">
				{#if !isParticipant && !isCreator}
					<Button
						class="w-full"
						variant="outline"
						onclick={() => handleAddParticipant(currentUserId)}
					>
						<UserPlusIcon class="mr-2 h-4 w-4" />
						Rejoindre le cours
					</Button>
				{/if}

				<div class="divide-y">
					{#each Object.entries(participants) as [userId, profile]}
						<div class="flex items-center justify-between py-2">
							<div class="flex items-center gap-2">
								{#if profile?.photoURL}
									<img
										src={profile.photoURL}
										alt={profile.displayName || profile.email}
										class="h-8 w-8 rounded-full"
									/>
								{:else}
									<div class="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
										<UserIcon class="h-4 w-4" />
									</div>
								{/if}
								<div>
									<p class="font-medium">
										{profile?.displayName || profile?.email || 'Utilisateur inconnu'}
									</p>
									{#if profile?.email}
										<p class="text-muted-foreground text-sm">{profile.email}</p>
									{/if}
								</div>
							</div>
							{#if isCreator && userId !== currentUserId}
								<Button variant="ghost" size="sm" onclick={() => handleRemoveParticipant(userId)}>
									<UserMinusIcon class="h-4 w-4" />
								</Button>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
