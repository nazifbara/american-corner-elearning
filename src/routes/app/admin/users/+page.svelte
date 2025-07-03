<script lang="ts">
	import { getProfiles } from '$lib/firebase/profiles';
	import { authState } from '$lib/state/shared.svelte';
	import type { Profile } from '$lib/firebase/profiles';
	import { Loader2Icon } from '@lucide/svelte';

	let profiles = $state<Profile[]>([]);
	let loading = $state(true);

	$effect(() => {
		if (authState.user) {
			fetchProfiles();
		}
	});
	async function fetchProfiles() {
		try {
			profiles = await getProfiles([authState.user!.uid]);
			console.log('Fetched profiles:', profiles);
		} catch (error) {
			console.error('Error fetching profiles:', error);
		} finally {
			loading = false;
		}
	}
</script>

<h1 class="text-2xl font-semibold">Utilisateurs</h1>

{#if loading}
	<div class="flex min-h-[200px] items-center justify-center">
		<Loader2Icon class="h-8 w-8 animate-spin" />
	</div>
{:else if profiles.length === 0}
	<div class="text-muted-foreground text-center">Aucun utilisateur trouvé.</div>
{:else}
	<ul>
		{#each profiles as profile}
			<li>{profile.email}</li>
		{/each}
	</ul>
{/if}
