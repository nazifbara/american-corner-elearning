<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Select from '$lib/components/ui/select';
	import { updateRoles } from '$lib/firebase/profiles';

	type Props = {
		roles: string[];
		uid: string;
	};

	let items = [
		{
			value: 'coach',
			label: 'Coah'
		},
		{
			value: 'admin',
			label: 'Administrateur'
		},
		{ value: 'student', label: 'Apprenant' }
	];

	let { roles = $bindable(), uid }: Props = $props();

	async function handleRole(role: string) {
		const previousRoles = [...roles];
		roles = [role];
		try {
			await updateRoles(uid, [role]);
		} catch (e) {
			toast.error('Erreur lors de la mise à jour du rôle');
			roles = previousRoles;
		}
	}
</script>

<Select.Root type="single" value={roles[0]} onValueChange={(value) => handleRole(value)}>
	<Select.Trigger>{roles[0] || 'Selectionnez rôle'}</Select.Trigger>
	<Select.Content>
		{#each items as role}
			<Select.Item value={role.value} label={role.label}>
				{role.label}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
