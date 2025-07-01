import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type Cohort } from '$lib/firebase/cohorts';

export function groupCohortsByYear(cohorts: Cohort[]): Array<[number, Cohort[]]> {
	const result: Array<[number, Cohort[]]> = [];
	const grouped: Record<number, Cohort[]> = {};
	cohorts.forEach((cohort) => {
		if (!grouped[cohort.year]) {
			grouped[cohort.year] = [];
		}
		grouped[cohort.year].push(cohort);
	});
	Object.keys(grouped)
		.sort((a, b) => parseInt(b) - parseInt(a)) // Sort years in descending order
		.forEach((year) => {
			result.push([parseInt(year), grouped[parseInt(year)]]);
		});
	return result;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
