<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { onMount, tick } from 'svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';
	import type { Profile } from '$lib/firebase/profiles';
	import { EntityList } from '$lib/state/entity-list-state.svelte';
	import { getResources, type Resource } from '$lib/firebase/resources';
	import { Loader2Icon } from '@lucide/svelte';

	type Props = {
		selectedResource: Resource | null;
		onChange?: (resource: Resource) => void;
	};

	const resourceList = new EntityList({ fetchFn: getResources });

	let { selectedResource = $bindable(), onChange }: Props = $props();
	let items = $derived(resourceList.data.map((c) => ({ value: c.id, label: c.title })));

	let open = $state(false);
	let value = $state(selectedResource?.id || '');
	let triggerRef = $state<HTMLButtonElement>(null!);
	const selectedValue = $derived(items.find((f) => f.value === value)?.label);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	onMount(() => {
		resourceList.fetch();
	});
</script>

<Popover.Root bind:open>
	{#if resourceList.loading}
		<Loader2Icon size={20} class="animate-spin" />
	{:else}
		<Popover.Trigger bind:ref={triggerRef}>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					class="w-full justify-between"
					role="combobox"
					aria-expanded={open}
				>
					{selectedValue || 'Selectionner une ressource...'}
					<ChevronsUpDownIcon class="opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger>
	{/if}
	<Popover.Content class="p-0">
		<Command.Root>
			<Command.Input placeholder="Rechercher ressource..." />
			<Command.List>
				<Command.Empty>Aucune ressource trouvé</Command.Empty>
				{#each items as item (item.value)}
					<Command.Item
						value={item.value}
						onSelect={() => {
							value = item.value;
							selectedResource = resourceList.data.find((c) => c.id === item.value) || null;
							onChange?.(selectedResource!);
							closeAndFocusTrigger();
						}}
					>
						<CheckIcon class={cn(value !== item.value && 'text-transparent')} />
						{item.label}
					</Command.Item>
				{/each}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
