<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { getStudents, type Profile } from '$lib/firebase/profiles';
	import { Loader2Icon, UserPlusIcon, SearchIcon, CheckIcon } from '@lucide/svelte';
	import { authState } from '$lib/state/shared.svelte';
	import { addParticipant, removeParticipant } from '$lib/firebase/cohorts';
	import { toast } from 'svelte-sonner';

	type Props = {
		members: Record<string, Profile | null>;
		cohortId: string;
	};

	let { members = $bindable(), cohortId }: Props = $props();
	let searchQuery = $state('');
	let allProfiles = $state<Profile[]>([]);
	let loading = $state(false);
	let searchResults = $state<Profile[]>([]);
	let pendingAdditions = $state<string[]>([]);
	let memberIds = $derived(Object.keys(members));

	let list = $derived.by(() => {
		return searchQuery ? searchResults : allProfiles;
	});

	$effect(() => {
		if (allProfiles.length === 0) {
			loadProfiles();
		}
	});

	function getListItemClass(profile: Profile) {
		if (memberIds.includes(profile.uid) || pendingAdditions.includes(profile.uid)) {
			return 'bg-muted';
		}
		return 'hover:bg-muted';
	}

	async function loadProfiles() {
		try {
			loading = true;
			allProfiles = await getStudents();
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
					// Filter out existing members and self
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
		if (memberIds.includes(profile.uid) || pendingAdditions.includes(profile.uid)) {
			console.warn('Participant already added:', profile.uid);
			return;
		}

		pendingAdditions = [...pendingAdditions, profile.uid];

		try {
			await addParticipant(cohortId, profile.uid);
			memberIds = [...memberIds, profile.uid];
			members[profile.uid] = profile;
		} catch (error) {
			console.error('Error adding participant:', error);
			toast.error("Une erreur s'est produite lors de l'ajout du participant");
		} finally {
			pendingAdditions = pendingAdditions.filter((id) => id !== profile.uid);
		}
	}

	async function handleUnselect(profile: Profile) {
		if (!memberIds.includes(profile.uid) || pendingAdditions.includes(profile.uid)) {
			return;
		}

		pendingAdditions.push(profile.uid);

		try {
			await removeParticipant(cohortId, profile.uid);
			memberIds = memberIds.filter((id) => id !== profile.uid);
			delete members[profile.uid];
		} catch (error) {
			console.error('Error removing participant:', error);
			toast.error("Une erreur s'est produite lors de la suppression du participant");
		} finally {
			pendingAdditions = pendingAdditions.filter((id) => id !== profile.uid);
		}
	}
</script>

<div class="space-y-4">
	<div class="relative">
		<SearchIcon class="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
		<Input class="pl-8" placeholder="Rechercher par email ou nom..." oninput={handleSearchTerm} />
	</div>

	{#if loading}
		<div class="flex min-h-[100px] items-center justify-center">
			<Loader2Icon class="h-6 w-6 animate-spin" />
		</div>
	{:else}
		<ul>
			{#each list as profile (profile.uid)}
				<li>
					<button
						class="{getListItemClass(profile)} flex w-full items-start gap-2 px-6 py-2"
						onclick={() =>
							memberIds.includes(profile.uid) ? handleUnselect(profile) : handleSelect(profile)}
					>
						{#if pendingAdditions.includes(profile.uid)}
							<Loader2Icon class="h-4 w-4 animate-spin" />
						{:else if memberIds.includes(profile.uid)}
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
