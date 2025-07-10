<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import { getProfile, type Profile } from '$lib/firebase/profiles';
	import { onMount } from 'svelte';

	type Props = {
		coachId: string | null;
	};

	let { coachId }: Props = $props();
	let coach: Profile | null = $state(null);
	let loading = $state(false);

	onMount(async () => {
		if (coachId) {
			try {
				loading = true;
				coach = await getProfile(coachId);
			} catch (error) {
				console.error('Error loading coach profile:', error);
				coach = null;
			} finally {
				loading = false;
			}
		}
	});
</script>

{#if loading}
	<span class="text-muted-foreground text-sm">
		<Loader2Icon class="animate-spin" />
	</span>
{:else if coach}
	<span class="text-muted-foreground text-sm">
		{coach.displayName || coach.email}
	</span>
{:else}
	<span class="text-muted-foreground text-sm">Aucun coach</span>
{/if}
