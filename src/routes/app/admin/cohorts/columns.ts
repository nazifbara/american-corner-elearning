import type { ColumnDef } from '@tanstack/table-core';
import type { Cohort } from '$lib/firebase/cohorts';
import { renderComponent } from '$lib/components/ui/data-table';
import MembersCell from './members-cell.svelte';

export const columns: ColumnDef<Cohort>[] = [
	{
		accessorKey: 'number',
		header: 'Numéro'
	},
	{
		accessorKey: 'year',
		header: 'Année'
	},
	{
		accessorKey: 'coach',
		header: 'Coach',
		cell: ({ row }) => row.original.coach || 'Aucun'
	},
	{
		accessorKey: 'members',
		header: 'Membres',
		cell: ({ row }) =>
			renderComponent(MembersCell, {
				members: row.original.members,
				cohortId: row.original.id
			})
	}
];
