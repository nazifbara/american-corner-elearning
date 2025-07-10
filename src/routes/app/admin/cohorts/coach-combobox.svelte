<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { onMount, tick } from 'svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';
	import type { Profile } from '$lib/firebase/profiles';
	import { coachList } from '$lib/state/shared.svelte';
	import { on } from 'svelte/events';

	type Props = {
		selectedCoach?: Profile | null;
		onChange?: (coach: Profile) => void;
	};

	let { selectedCoach = $bindable(), onChange }: Props = $props();
	let items = $derived(
		coachList.coaches.map((c) => ({ value: c.uid, label: c.displayName })) || []
	);

	let open = $state(false);
	let value = $state(selectedCoach?.uid || '');
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
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class="w-[200px] justify-between"
				role="combobox"
				aria-expanded={open}
			>
				{selectedValue || 'Selectionner un coach...'}
				<ChevronsUpDownIcon class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input placeholder="Rechercher coach..." />
			<Command.List>
				<Command.Empty>Aucun coach trouvé</Command.Empty>
				<Command.Group value="frameworks">
					{#each items as item (item.value)}
						<Command.Item
							value={item.value}
							onSelect={() => {
								value = item.value;
								onChange?.(coachList.coaches.find((c) => c.uid === item.value)!);
								closeAndFocusTrigger();
							}}
						>
							<CheckIcon class={cn(value !== item.value && 'text-transparent')} />
							{item.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
