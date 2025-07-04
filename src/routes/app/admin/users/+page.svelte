<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { DataTable } from '$lib/components/ui/data-table';
	import { columns } from './columns';
	import { getProfiles } from '$lib/firebase/profiles';
	import { authState } from '$lib/state/shared.svelte';
	import type { Profile } from '$lib/firebase/profiles';
	import { Loader2Icon, RotateCcwIcon } from '@lucide/svelte';

	let profiles: Profile[] = $state([]);
	let loading = $state(true);
	let error: string | null = $state(null);

	$effect(() => {
		if (authState.user) {
			fetchProfiles();
		}
	});
	async function fetchProfiles() {
		try {
			loading = true;
			profiles = await getProfiles([authState.user!.uid]);
			console.log('Fetched profiles:', profiles);
		} catch (err) {
			console.error('Error fetching profiles:', err);
			error = 'Une erreur est survenue lors de la récupération des utilisateurs.';
		} finally {
			loading = false;
		}
	}
</script>

<h1 class="mb-8 text-2xl font-semibold">Utilisateurs</h1>

{#if loading}
	<div class="flex min-h-[200px] items-center justify-center">
		<Loader2Icon class="h-8 w-8 animate-spin" />
	</div>
{:else if error}
	<div class="flex min-h-[200px] flex-col items-center justify-center">
		<div class="text-destructive text-center">{error}</div>
		<Button variant="outline" class="btn btn-outline mt-2" onclick={fetchProfiles}>
			<RotateCcwIcon class="mr-2" />
			Réessayer
		</Button>
	</div>
{:else if profiles.length === 0}
	<div class="text-muted-foreground text-center">Aucun utilisateur trouvé.</div>
{:else}
	<div class="mx-auto w-full max-w-2xl">
		<DataTable data={profiles} {columns} />
	</div>
{/if}
