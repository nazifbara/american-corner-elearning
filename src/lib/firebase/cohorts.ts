import { firestore } from '$lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export type Cohort = {
	id: string;
	number: number;
	year: number;
};

const cohortsRef = collection(firestore, 'cohorts');

export async function getCohorts() {
	try {
		const cohortsRef = collection(firestore, 'cohorts');
		const querySnapshot = await getDocs(cohortsRef);
		const cohorts: Array<Cohort> = [];
		querySnapshot.forEach((doc) => {
			cohorts.push({
				id: doc.id,
				...(doc.data() as Omit<Cohort, 'id'>)
			});
		});
		return cohorts;
	} catch (error) {
		console.error('Error fetching cohorts:', error);
		throw new Error('Failed to fetch cohorts');
	}
}

export async function getCohort(param: { number: number; year: number }) {
	try {
		const q = query(
			cohortsRef,
			where('number', '==', param.number),
			where('year', '==', param.year)
		);
		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			return null;
		}
		const cohortData = querySnapshot.docs[0].data() as Omit<Cohort, 'id'>;
		return {
			id: querySnapshot.docs[0].id,
			...cohortData
		} as Cohort;
	} catch (error) {
		console.error('Error fetching cohort:', error);
		throw new Error('Failed to fetch cohort');
	}
}
