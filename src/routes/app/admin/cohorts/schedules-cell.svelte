<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Dialog from '$lib/components/ui/dialog';
	import { saveCohortSchedules } from '$lib/firebase/cohorts';
	import { toast } from 'svelte-sonner';
	import { Loader2 } from '@lucide/svelte';

	type Props = {
		cohortId: string;
		schedules: Record<number, string | null>;
	};

	let { cohortId, schedules }: Props = $props();

	const days = [
		{ num: 1, name: 'Lundi' },
		{ num: 2, name: 'Mardi' },
		{ num: 3, name: 'Mercredi' },
		{ num: 4, name: 'Jeudi' },
		{ num: 5, name: 'Vendredi' },
		{ num: 6, name: 'Samedi' },
		{ num: 7, name: 'Dimanche' }
	];

	let saving = $state(false);

	async function handleSave() {
		saving = true;
		try {
			await saveCohortSchedules(cohortId, schedules);
			toast.success('Horaires enregistrés avec succès.');
		} catch (e) {
			toast.error("Une erreur est survenue lors de l'enregistrement des horaires.");
		} finally {
			saving = false;
		}
	}
</script>

<div>
	<Dialog.Root>
		<Dialog.Trigger>
			<Button variant="outline" size="sm" type="button">Voir/Modifier les horaires</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Horaires de la semaine</Dialog.Title>
			</Dialog.Header>
			<div
				class="grid gap-2"
				onsubmit={(e) => {
					e.preventDefault();
				}}
			>
				{#each days as day}
					<div class="grid grid-cols-3 gap-4">
						<label for="horaire-{day.num}" class="font-medium">{day.name}</label>
						<Input id="horaire-{day.num}" type="time" bind:value={schedules[day.num]} />
						<span class="text-muted-foreground">
							{schedules[day.num] ? '' : 'Non défini'}
						</span>
					</div>
				{/each}
			</div>
			<Dialog.Footer>
				<Button onclick={handleSave} disabled={saving}>
					{#if saving}
						<Loader2 class="animate-spin" />
					{/if}
					Enregistrer
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>
