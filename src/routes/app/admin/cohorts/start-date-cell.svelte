<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { updateCohortStartDate } from '$lib/firebase/cohorts';
	import { Loader2Icon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	type Props = {
		cohortId: string;
		startDate: string | null;
	};

	let { cohortId, startDate }: Props = $props();
	let localDate: string | null = $state(startDate);
	let prevDate: string | null = $state(startDate);
	let loading = $state(false);

	async function handleChange(e: Event) {
		loading = true;
		const input = e.target as HTMLInputElement;
		const newDate = input.value || null;
		prevDate = localDate;
		localDate = newDate;
		try {
			await updateCohortStartDate(cohortId, newDate);
			toast.success('Date de début mise à jour avec succès.');
		} catch (err) {
			localDate = prevDate;
			toast.error('Échec de la mise à jour de la date de début.');
		} finally {
			loading = false;
		}
	}
</script>

{#if loading}
	<Loader2Icon class="animate-spin" />
{:else}
	<Input type="date" bind:value={localDate} onchange={handleChange} />
{/if}
