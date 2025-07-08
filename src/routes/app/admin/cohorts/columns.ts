import type { ColumnDef } from '@tanstack/table-core';
import type { Cohort } from '$lib/firebase/cohorts';
import { renderComponent } from '$lib/components/ui/data-table';
import ParticipantsCell from './participants-cell.svelte';

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
		accessorKey: 'participants',
		header: 'Participants',
		cell: ({ row }) =>
			renderComponent(ParticipantsCell, {
				participants: row.original.participants,
				cohortId: row.original.id
			})
	}
];
