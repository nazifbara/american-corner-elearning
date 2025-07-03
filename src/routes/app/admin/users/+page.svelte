<script lang="ts">
	import { getProfiles } from '$lib/firebase/profiles';
	import { authState } from '$lib/state/shared.svelte';

	$effect(() => {
		if (authState.user) {
			fetchProfiles();
		}
	});
	async function fetchProfiles() {
		try {
			const profiles = await getProfiles([authState.user!.uid]);
			console.log('Fetched profiles:', profiles);
		} catch (error) {
			console.error('Error fetching profiles:', error);
		}
	}
</script>

<h1 class="text-2xl font-semibold">Utilisateurs</h1>
