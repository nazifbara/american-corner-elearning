import type { ColumnDef } from '@tanstack/table-core';
import type { Cohort } from '$lib/firebase/cohorts';
import { renderComponent } from '$lib/components/ui/data-table';
import MembersCell from './members-cell.svelte';
import CoachCell from './coach-cell.svelte';
import SchedulesCell from './schedules-cell.svelte';

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
		cell: ({ row }) =>
			renderComponent(CoachCell, {
				coachId: row.original.coach,
				cohortId: row.original.id
			})
	},
	{
		accessorKey: 'members',
		header: 'Membres',
		cell: ({ row }) =>
			renderComponent(MembersCell, {
				members: row.original.members,
				cohortId: row.original.id
			})
	},
	{
		accessorKey: 'schedules',
		header: 'Horaires',
		cell: ({ row }) => renderComponent(SchedulesCell, { schedules: row.original.schedules })
	}
];
