<script lang="ts">
	import { PlusIcon, Loader2 } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import { addCourse, type Course } from '$lib/firebase/courses';
	import { authState } from '$lib/state/shared.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';

	type Props = {
		onAdd?: (course: Course) => void;
	};
	let { onAdd }: Props = $props();

	let loading = $state(false);
	let open = $state(false);
	let title = $state('');
	let description = $state('');

	async function hanldNewCourse() {
		if (loading || !title.trim() || !description.trim()) {
			toast.error('Veuillez remplir tous les champs.');
			return;
		}
		loading = true;
		title = title.trim();
		description = description.trim();

		const newCourse = await addCourse({ title, description, userId: authState?.user?.uid ?? '' });
		description = '';
		title = '';
		toast.success('Le cours a été ajouté avec succès !');
		loading = false;
		open = false;
		if (onAdd) {
			onAdd(newCourse);
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button><PlusIcon /> Ajouter un cours</Button>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Ajouter un cours</Dialog.Title>
			<Dialog.Description>Ajouter un nouveau cours</Dialog.Description>
		</Dialog.Header>
		<div class="grid grid-cols-4 items-center gap-4">
			<Label for="name" class="self-start text-right">Titre</Label>
			<Input id="name" class="col-span-3" bind:value={title} disabled={loading} />
		</div>
		<div class="grid grid-cols-4 items-center justify-start gap-4">
			<Label for="username" class="self-start text-right">Description</Label>
			<Textarea
				id="description"
				class="col-span-3 h-32"
				bind:value={description}
				disabled={loading}
			/>
		</div>
		<Dialog.Footer>
			<Button disabled={loading} type="submit" onclick={hanldNewCourse}>
				{#if loading}
					<Loader2 class="animate-spin" />
				{/if} Ajouter</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
