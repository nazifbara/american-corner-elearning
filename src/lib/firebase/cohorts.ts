import { firestore } from '$lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export type Cohort = {
	id: string;
	num: number;
	year: number;
};

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
