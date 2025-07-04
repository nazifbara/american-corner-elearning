import type { ColumnDef } from '@tanstack/table-core';
import type { Profile } from '$lib/firebase/profiles';
import { renderComponent } from '$lib/components/ui/data-table';
import RolesSelect from './roles-select.svelte';

export const columns: ColumnDef<Profile>[] = [
	{
		accessorKey: 'displayName',
		header: 'Nom'
	},
	{
		accessorKey: 'email',
		header: 'Email'
	},
	{
		accessorKey: 'roles',
		header: 'Rôles',
		cell: ({ row }) =>
			renderComponent(RolesSelect, { roles: row.original.roles, uid: row.original.uid })
	}
];
