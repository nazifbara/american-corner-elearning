<script lang="ts">
	import {
		PlusIcon,
		Loader2Icon,
		RotateCcwIcon,
		YoutubeIcon,
		PenIcon,
		CheckIcon,
		XIcon
	} from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import { type Resource } from '$lib/firebase/resources';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { EntityList } from '$lib/state/entity-list-state.svelte';
	import { addResource, getResources } from '$lib/firebase/resources';
	import { authState } from '$lib/state/shared.svelte';
	import { onMount } from 'svelte';

	let title = $state('');
	let url = $state('');
	let resourceToEdit: Resource | null = $state(null);

	const resourceList = new EntityList({
		addFn: () => addResource({ title, url, creatorId: authState.user!.uid }),
		fetchFn: getResources
	});

	onMount(() => {
		resourceList.fetch();
	});

	function handleResourceEdit() {
		console.log('Editing resource:', resourceToEdit);
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (title && url && !resourceList.adding && !resourceList.loading) {
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

<div class="mx-auto grid max-w-4xl gap-6">
	<h1 class="text-2xl">Gestion des ressources</h1>

	<div>
		<h2 class="mb-2 text-lg">Ajouter une ressource</h2>
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

	{#if resourceList.loading}
		<div class="flex min-h-[200px] items-center justify-center">
			<Loader2Icon class="h-8 w-8 animate-spin" />
		</div>
	{:else if resourceList.error}
		<div class="flex min-h-[200px] flex-col items-center justify-center">
			<div class="text-destructive text-center">{resourceList.error}</div>
			<Button variant="outline" class="mt-2" onclick={() => resourceList.fetch()}>
				<RotateCcwIcon size={20} />
				Réessayer
			</Button>
		</div>
	{:else if resourceList.data.length === 0}
		<div class="text-muted-foreground text-center">Aucune ressource trouvée.</div>
	{:else}
		<div>
			<h2 class="mb-2 text-lg">Liste des ressources</h2>
			<ul class="">
				{#each resourceList.data as resource (resource.id)}
					<li class="border-b p-2">
						{#if resource.id === resourceToEdit?.id}
							<form
								class="flex items-center gap-2"
								onsubmit={(e) => {
									e.preventDefault();
									handleResourceEdit();
								}}
							>
								<Input
									type="text"
									bind:value={resourceToEdit.title}
									placeholder="Modifier le titre..."
									class="w-full"
								/>
								<Input
									type="url"
									bind:value={resourceToEdit.url}
									placeholder="Modifier l'URL..."
									class="w-full"
								/>
								<div class="flex items-center gap-2">
									<Button size="icon" type="submit" aria-label="Enregistrer les modifications">
										<CheckIcon size={16} />
									</Button>
									<Button
										size="icon"
										variant="outline"
										aria-label="Annuler les modifications"
										onclick={() => (resourceToEdit = null)}
									>
										<XIcon size={16} />
									</Button>
								</div>
							</form>
						{:else}
							<div class="grid grid-cols-[auto_1fr] items-start gap-2">
								<Button
									title="modidier"
									size="icon"
									variant="outline"
									aria-label="modifier"
									onclick={() => {
										resourceToEdit = JSON.parse(JSON.stringify(resource));
									}}><PenIcon size={16} /></Button
								>
								<span>
									<span>{resource.title}</span>
									<span class="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
										<YoutubeIcon size={14} /> youtube</span
									>
								</span>
							</div>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
