<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Dialog from '$lib/components/ui/dialog';

	type Props = {
		schedules: Record<number, string | null>;
	};

	let { schedules }: Props = $props();

	const days = [
		{ num: 1, name: 'Lundi' },
		{ num: 2, name: 'Mardi' },
		{ num: 3, name: 'Mercredi' },
		{ num: 4, name: 'Jeudi' },
		{ num: 5, name: 'Vendredi' },
		{ num: 6, name: 'Samedi' },
		{ num: 7, name: 'Dimanche' }
	];

	let dialogOpen = $state(false);
	let selectedDay = $state<number | null>(null);
	let tempTime = $state<string>('');

	function openDialog(dayNum: number) {
		selectedDay = dayNum;
		tempTime = schedules[dayNum] ?? '';
		dialogOpen = true;
	}

	function closeDialog() {
		dialogOpen = false;
		selectedDay = null;
		tempTime = '';
	}

	function saveTime() {
		if (selectedDay !== null) {
			schedules[selectedDay] = tempTime || null;
		}
		closeDialog();
	}
</script>

<div>
	<Button
		variant="outline"
		size="sm"
		type="button"
		onclick={() => {
			dialogOpen = true;
		}}
	>
		Voir/Modifier les horaires
	</Button>

	<Dialog.Root
		open={dialogOpen}
		onOpenChange={(open) => {
			if (!open) closeDialog();
		}}
	>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Horaires de la semaine</Dialog.Title>
			</Dialog.Header>
			<div
				class="grid gap-2"
				onsubmit={(e) => {
					e.preventDefault();
					closeDialog();
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
				<Button>Enregistrer</Button>
				<Button variant="outline" onclick={closeDialog}>Annuler</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>
