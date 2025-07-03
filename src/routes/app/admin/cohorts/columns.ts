import type { ColumnDef } from '@tanstack/table-core';
import type { Cohort } from '$lib/firebase/cohorts';

export const columns: ColumnDef<Cohort>[] = [
	{
		accessorKey: 'number',
		header: 'Numéro'
	},
	{
		accessorKey: 'year',
		header: 'Année'
	}
];
