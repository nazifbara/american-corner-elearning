<script lang="ts">
	import { PlusIcon } from '@lucide/svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	let label = $state('');
	let url = $state('');

	function handleSubmit(event: Event) {
		event.preventDefault();
	}
</script>

<div class="mx-auto grid max-w-4xl">
	<h1 class="mb-4 text-2xl">Gestion des ressources</h1>
	<form class="flex items-center gap-2">
		<Input
			type="text"
			bind:value={label}
			required
			placeholder="Donnez un titre à la video youtube..."
		/>
		<Input
			type="url"
			bind:value={url}
			required
			placeholder="Ajouter l'URL de la video youtube..."
		/>
		<Button size="icon" type="submit" aria-label="Ajouter"><PlusIcon /></Button>
	</form>
</div>
