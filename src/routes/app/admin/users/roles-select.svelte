<script lang="ts">
	import * as Select from '$lib/components/ui/select';

	type Props = {
		roles: string[];
		uid: string;
	};

	let items = [
		{
			value: 'user',
			label: 'utilisateur'
		},
		{
			value: 'coach',
			label: 'Coah'
		},
		{
			value: 'admin',
			label: 'Administrateur'
		}
	];

	let { roles = $bindable(), uid }: Props = $props();
</script>

<Select.Root type="multiple" bind:value={roles}>
	<Select.Trigger>{roles.join(', ')}</Select.Trigger>
	<Select.Content>
		{#each items as role}
			<Select.Item value={role.value} label={role.label}>
				{role.label}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
