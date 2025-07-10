import { firestore } from '$lib/firebase';
import {
	collection,
	getDocs,
	query,
	where,
	addDoc,
	updateDoc,
	doc,
	deleteField
} from 'firebase/firestore';

export type Cohort = {
	id: string;
	number: number;
	year: number;
	coach: string | null;
	members: Record<string, true>;
};

const cohortsRef = collection(firestore, 'cohorts');

export async function updateCohortCoach(cohortId: string, coachId: string) {
	try {
		const cohortRef = doc(firestore, 'cohorts', cohortId);
		const profileRef = doc(firestore, 'profiles', coachId);
		await Promise.all([
			updateDoc(cohortRef, {
				coach: coachId
			}),
			updateDoc(profileRef, {
				[`assignedCohorts.${cohortId}`]: true
			})
		]);
	} catch (error) {
		console.error('Error updating coach:', error);
		throw new Error('Failed to update coach');
	}
}

export async function addParticipant(cohortId: string, userId: string): Promise<void> {
	try {
		const cohortRef = doc(firestore, 'cohorts', cohortId);
		const profileRef = doc(firestore, 'profiles', userId);
		await Promise.all([
			updateDoc(cohortRef, {
				[`members.${userId}`]: true
			}),
			updateDoc(profileRef, {
				[`cohorts.${cohortId}`]: true
			})
		]);
	} catch (error) {
		console.error('Error adding participant:', error);
		throw new Error('Failed to add participant');
	}
}

export async function removeParticipant(cohortId: string, userId: string): Promise<void> {
	try {
		const cohortRef = doc(firestore, 'cohorts', cohortId);
		const profileCourseRef = doc(firestore, 'profiles', userId);
		await Promise.all([
			updateDoc(cohortRef, { [`members.${userId}`]: deleteField() }),
			updateDoc(profileCourseRef, { [`cohorts.${cohortId}`]: deleteField() })
		]);
	} catch (error) {
		console.error('Error removing participant:', error);
		throw new Error('Failed to remove participant');
	}
}

export async function countCohortsByYear(year: number): Promise<number> {
	try {
		const q = query(cohortsRef, where('year', '==', year));
		const querySnapshot = await getDocs(q);
		return querySnapshot.size;
	} catch (error) {
		console.error('Error counting current year cohorts:', error);
		throw new Error('Failed to count current year cohorts');
	}
}

export async function addCohort(cohort: Omit<Cohort, 'id' | 'members' | 'coach'>): Promise<Cohort> {
	try {
		const data = { ...cohort, members: {}, coach: null };
		const docRef = await addDoc(cohortsRef, data);
		return { id: docRef.id, ...data };
	} catch (error) {
		console.error('Error adding cohort:', error);
		throw new Error('Failed to add cohort');
	}
}

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
		return cohorts.sort((a, b) => b.year - a.year || b.number - a.number);
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
