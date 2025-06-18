<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { getProfiles, type Profile } from '$lib/firebase/profiles';
	import { Loader2Icon, UserPlusIcon, SearchIcon, CheckIcon, UserCog } from '@lucide/svelte';
	import { authState } from '$lib/state/shared.svelte';
	import { addParticipant, removeParticipant } from '$lib/firebase/courses';
	import { toast } from 'svelte-sonner';

	type Props = {
		participants: Record<string, Profile | null>;
		courseId: string;
	};

	let { participants = $bindable(), courseId }: Props = $props();
	let open = $state(false);
	let searchQuery = $state('');
	let allProfiles = $state<Profile[]>([]);
	let loading = $state(false);
	let searchResults = $state<Profile[]>([]);
	let pendingAdditions = $state<string[]>([]);
	let participantIds = $derived(
		Object.keys(participants).filter((id) => participants[id] !== null)
	);

	let list = $derived.by(() => {
		return searchQuery ? searchResults : allProfiles;
	});

	$effect(() => {
		if (open && allProfiles.length === 0) {
			loadProfiles();
		}

		if (!open) {
			searchQuery = '';
			searchResults = [];
		}
	});

	function getListItemClass(profile: Profile) {
		if (participantIds.includes(profile.uid) || pendingAdditions.includes(profile.uid)) {
			return 'bg-muted';
		}
		return 'hover:bg-muted';
	}

	async function loadProfiles() {
		try {
			loading = true;
			allProfiles = await getProfiles([authState.user!.uid]); // Exclude self
		} catch (error) {
			console.error('Error loading profiles:', error);
		} finally {
			loading = false;
		}
	}

	function handleSearchTerm(event: Event) {
		const input = event.target as HTMLInputElement;
		searchQuery = input.value.trim();
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			searchResults = allProfiles.filter(
				(profile) =>
					// Filter out existing participants and self
					profile.uid !== authState.user!.uid &&
					// Search in email and display name
					(profile.email.toLowerCase().includes(query) ||
						(profile.displayName?.toLowerCase() || '').includes(query))
			);
			console.log('Search results:', searchResults);
		} else {
			searchResults = [];
		}
	}

	async function handleSelect(profile: Profile) {
		if (participantIds.includes(profile.uid) || pendingAdditions.includes(profile.uid)) {
			console.warn('Participant already added:', profile.uid);
			return;
		}

		pendingAdditions = [...pendingAdditions, profile.uid];

		try {
			await addParticipant(courseId, profile.uid);
			participantIds = [...participantIds, profile.uid];
			participants[profile.uid] = profile;
		} catch (error) {
			console.error('Error adding participant:', error);
			toast.error("Une erreur s'est produite lors de l'ajout du participant");
		} finally {
			pendingAdditions = pendingAdditions.filter((id) => id !== profile.uid);
		}
	}

	async function handleUnselect(profile: Profile) {
		if (!participantIds.includes(profile.uid) || pendingAdditions.includes(profile.uid)) {
			return;
		}

		pendingAdditions.push(profile.uid);

		try {
			await removeParticipant(courseId, profile.uid);
			participantIds = participantIds.filter((id) => id !== profile.uid);
			delete participants[profile.uid];
		} catch (error) {
			console.error('Error removing participant:', error);
			toast.error("Une erreur s'est produite lors de la suppression du participant");
		} finally {
			pendingAdditions = pendingAdditions.filter((id) => id !== profile.uid);
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button variant="outline" class="w-full">
			<UserCog class="mr-2 h-4 w-4" />
			Géerer les participants
		</Button>
	</Dialog.Trigger>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>Ajouter des participants</Dialog.Title>
			<Dialog.Description>
				Recherchez des utilisateurs par email ou nom pour les ajouter au cours.
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4">
			<div class="relative">
				<SearchIcon class="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
				<Input
					class="pl-8"
					placeholder="Rechercher par email ou nom..."
					oninput={handleSearchTerm}
				/>
			</div>

			{#if loading}
				<div class="flex min-h-[100px] items-center justify-center">
					<Loader2Icon class="h-6 w-6 animate-spin" />
				</div>
			{:else}
				<ul>
					{#each list as profile (profile.uid)}
						<li class="-mx-6">
							<button
								class="{getListItemClass(profile)} flex w-full items-start gap-2 px-6 py-2"
								onclick={() =>
									participantIds.includes(profile.uid)
										? handleUnselect(profile)
										: handleSelect(profile)}
							>
								{#if pendingAdditions.includes(profile.uid)}
									<Loader2Icon class="h-4 w-4 animate-spin" />
								{:else if participantIds.includes(profile.uid)}
									<CheckIcon class="h-4 w-4" />
								{:else}
									<UserPlusIcon class="h-4 w-4" />
								{/if}
								<div class="flex flex-col items-start">
									<span class="text-sm font-medium">
										{profile.displayName || 'Sans nom'}
									</span>
									<span class="text-sm">
										{profile.email}
									</span>
								</div>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
