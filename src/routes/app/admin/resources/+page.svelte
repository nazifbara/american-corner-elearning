<script lang="ts">
	import { PlusIcon, Loader2Icon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { EntityList } from '$lib/state/entity-list-state.svelte';
	import { addResource } from '$lib/firebase/resources';
	import { authState } from '$lib/state/shared.svelte';

	let title = $state('');
	let url = $state('');

	const resourceList = new EntityList({
		addFn: () => addResource({ title, url, creatorId: authState.user!.uid })
	});

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (title && url && !resourceList.adding) {
			await resourceList.add({
				onSuccess: () => {
					toast.success('Ressource ajoutée avec succès');

					title = '';
					url = '';
				},
				onError: () => {
					toast.error("Une erreur est survenue lors de l'ajout de la ressource.");
				}
			});
		}
	}
</script>

<div class="mx-auto grid max-w-4xl">
	<h1 class="mb-4 text-2xl">Gestion des ressources</h1>
	<form class="flex items-center gap-2" onsubmit={handleSubmit}>
		<Input
			type="text"
			bind:value={title}
			required
			placeholder="Donnez un titre à la video youtube..."
			disabled={resourceList.adding}
		/>
		<Input
			type="url"
			bind:value={url}
			required
			placeholder="Ajouter l'URL de la video youtube..."
			disabled={resourceList.adding}
		/>
		<Button size="icon" type="submit" aria-label="Ajouter">
			{#if resourceList.adding}
				<Loader2Icon size={20} class="animate-spin" />
			{:else}
				<PlusIcon size={20} />
			{/if}
		</Button>
	</form>
</div>
