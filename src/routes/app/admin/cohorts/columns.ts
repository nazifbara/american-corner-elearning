import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { Cohort } from '$lib/firebase/cohorts';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import MembersCell from './members-cell.svelte';
import CoachCell from './coach-cell.svelte';
import SchedulesCell from './schedules-cell.svelte';
import StartDateCell from './start-date-cell.svelte';

export const columns: ColumnDef<Cohort>[] = [
	{
		accessorKey: 'number',
		header: () => {
			const numberCellSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-center font-medium">Numéro</div>`
			}));

			return renderSnippet(numberCellSnippet, '');
		},
		cell: ({ row }) => {
			const numberCellSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-center font-medium">${row.original.number}</div>`
			}));

			return renderSnippet(numberCellSnippet, '');
		}
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
		cell: ({ row }) =>
			renderComponent(SchedulesCell, {
				cohortId: row.original.id,
				schedules: row.original.schedules
			})
	},
	{
		accessorKey: 'startDate',
		header: 'Début',
		cell: ({ row }) =>
			renderComponent(StartDateCell, {
				cohortId: row.original.id,
				startDate: row.original.startDate
			})
	}
];
