<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte';
	import { getProfile, type Profile } from '$lib/firebase/profiles';
	import { unsasignCohort, updateCohortCoach } from '$lib/firebase/cohorts';
	import { onMount } from 'svelte';
	import CoachCombobox from './coach-combobox.svelte';

	type Props = {
		coachId: string | null;
		cohortId: string;
	};

	let { coachId, cohortId }: Props = $props();
	let selectedCoach: Profile | null = $state(null);
	let loading = $state(false);

	onMount(async () => {
		if (coachId) {
			try {
				loading = true;
				selectedCoach = await getProfile(coachId);
			} catch (error) {
				console.error('Error loading coach profile:', error);
				selectedCoach = null;
			} finally {
				loading = false;
			}
		}
	});

	async function handleCoach(coach: Profile) {
		try {
			loading = true;
			if (selectedCoach) {
				await unsasignCohort(cohortId, selectedCoach.uid);
			}
			await updateCohortCoach(cohortId, coach.uid);
			selectedCoach = coach;
		} catch (e) {
			console.error("Error update cohort's coach: ", e);
		} finally {
			loading = false;
		}
	}
</script>

{#if loading}
	<span class="text-muted-foreground text-sm">
		<Loader2Icon class="animate-spin" />
	</span>
{:else}
	<CoachCombobox bind:selectedCoach onChange={handleCoach} />
{/if}
