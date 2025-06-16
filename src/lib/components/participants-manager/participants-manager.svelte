<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Command from '$lib/components/ui/command';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { getProfiles, type Profile } from '$lib/firebase/profiles';
	import {
		Loader2Icon,
		UserPlusIcon,
		UserIcon,
		SearchIcon,
		CheckIcon,
		PlusIcon
	} from '@lucide/svelte';
	import { authState } from '$lib/state/shared.svelte';

	type Props = {
		participants: Record<string, Profile | null>;
		onAddParticipant?: (userId: string) => void;
	};

	let { participants, onAddParticipant }: Props = $props();
	let open = $state(false);
	let searchQuery = $state('');
	let allProfiles = $state<Profile[]>([]);
	let loading = $state(false);
	let searchResults = $state<Profile[]>([]);
	let list = $derived.by(() => {
		return searchQuery ? searchResults : allProfiles;
	});

	$effect(() => {
		if (open && allProfiles.length === 0) {
			loadProfiles();
		}
	});

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

	function handleSelect(profile: Profile) {
		onAddParticipant?.(profile.uid);
		searchQuery = '';
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button variant="outline" class="w-full">
			<UserPlusIcon class="mr-2 h-4 w-4" />
			Ajouter des participants
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
						<li class="flex items-start gap-2 py-2">
							<Button variant="ghost" size="icon">
								<UserPlusIcon />
							</Button>
							<div class="flex items-center gap-3">
								<div class="flex flex-col">
									<span class="text-sm font-medium">
										{profile.displayName || 'Sans nom'}
									</span>
									<span class="text-muted-foreground text-sm">
										{profile.email}
									</span>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
