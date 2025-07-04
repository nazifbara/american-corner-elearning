import type { ColumnDef } from '@tanstack/table-core';
import type { Profile } from '$lib/firebase/profiles';

export const columns: ColumnDef<Profile>[] = [
	{
		accessorKey: 'displayName',
		header: 'Nom'
	},
	{
		accessorKey: 'email',
		header: 'Email'
	},
	{ accessorKey: 'roles', header: 'Rôles', cell: ({ row }) => row.original.roles.join(', ') }
];
