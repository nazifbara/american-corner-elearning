import { firestore } from '$lib/firebase';
import {
	collection,
	getDocs,
	query,
	where,
	addDoc,
	updateDoc,
	doc,
	deleteField,
	getDoc
} from 'firebase/firestore';
import type { Profile } from './profiles';

export type Cohort = {
	id: string;
	number: number;
	year: number;
	coach: string | null;
	members: Record<string, true>;
	resources?: Record<string, { description: string; creatorId: string; name: string }>;
	schedules: Record<number, string | null>;
	startDate: string | null;
};

export type CreateCohort = {
	number: number;
	year: number;
};

const cohortsRef = collection(firestore, 'cohorts');

export async function getCurrentCohort(profile: Profile): Promise<Cohort | null> {
	try {
		const id = Object.keys(profile.cohorts)[0];
		if (!id) {
			return null;
		}
		const cohortRef = doc(firestore, 'cohorts', id);
		const snapshot = await getDoc(cohortRef);
		if (!snapshot.exists) {
			return null;
		}
		return { id: snapshot.id, ...snapshot.data() } as Cohort;
	} catch (error) {
		console.error("Error getting user's cohort:", error);
		throw new Error("Failed to get user's cohort");
	}
}

export async function getLearnerCohorts(profile: Profile): Promise<Cohort[]> {
	try {
		const cohortIds = Object.keys(profile.cohorts);
		if (cohortIds.length === 0) {
			return [];
		}
		const cohortPromises = cohortIds.map(async (id) => {
			const cohortRef = doc(firestore, 'cohorts', id);
			const snapshot = await getDoc(cohortRef);
			if (!snapshot.exists) {
				return null;
			}
			return { id: snapshot.id, ...snapshot.data() } as Cohort;
		});
		const cohorts = await Promise.all(cohortPromises);
		return cohorts
			.filter((cohort): cohort is Cohort => cohort !== null)
			.sort((a, b) => b.year - a.year || b.number - a.number);
	} catch (error) {
		console.error('Error getting learner cohorts:', error);
		throw new Error('Failed to get learner cohorts');
	}
}

export async function getCoachCohorts(profile: Profile): Promise<Cohort[]> {
	try {
		const cohortIds = Object.keys(profile.assignedCohorts);
		if (cohortIds.length === 0) {
			return [];
		}
		const cohortPromises = cohortIds.map(async (id) => {
			const cohortRef = doc(firestore, 'cohorts', id);
			const snapshot = await getDoc(cohortRef);
			if (!snapshot.exists) {
				return null;
			}
			return { id: snapshot.id, ...snapshot.data() } as Cohort;
		});
		const cohorts = await Promise.all(cohortPromises);
		return cohorts
			.filter((cohort): cohort is Cohort => cohort !== null)
			.sort((a, b) => b.year - a.year || b.number - a.number);
	} catch (error) {
		console.error('Error getting coach cohorts:', error);
		throw new Error('Failed to get coach cohorts');
	}
}

export async function updateCohortStartDate(
	cohortId: string,
	startDate: string | null
): Promise<void> {
	try {
		const cohortRef = doc(firestore, 'cohorts', cohortId);
		await updateDoc(cohortRef, { startDate });
	} catch (error) {
		console.error('Error updating cohort startDate:', error);
		throw new Error('Failed to update cohort startDate');
	}
}

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

export async function unsasignCohort(cohortId: string, coachId: string) {
	try {
		const cohortRef = doc(firestore, 'cohorts', cohortId);
		const profileRef = doc(firestore, 'profiles', coachId);
		await Promise.all([
			updateDoc(cohortRef, {
				coach: null
			}),
			updateDoc(profileRef, {
				[`assignedCohorts.${cohortId}`]: deleteField()
			})
		]);
	} catch (error) {
		console.error('Error unsasigning coach:', error);
		throw new Error('Failed to unsasign coach');
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

export async function addCohort(cohort: CreateCohort): Promise<Cohort> {
	try {
		const data = {
			...cohort,
			members: {},
			coach: null,
			schedules: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null },
			startDate: null
		};
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

export async function getCohort(id: string) {
	try {
		const cohortRef = doc(firestore, 'cohorts', id);
		const querySnapshot = await getDoc(cohortRef);
		if (!querySnapshot.exists()) {
			return null;
		}
		const cohortData = querySnapshot.data() as Omit<Cohort, 'id'>;
		return {
			id: querySnapshot.id,
			...cohortData
		} as Cohort;
	} catch (error) {
		console.error('Error fetching cohort:', error);
		throw new Error('Failed to fetch cohort');
	}
}

export async function saveCohortSchedules(
	cohortId: string,
	schedules: Record<number, string | null>
): Promise<void> {
	try {
		const cohortRef = doc(firestore, 'cohorts', cohortId);
		await updateDoc(cohortRef, { schedules });
	} catch (error) {
		console.error('Error saving cohort schedules:', error);
		throw new Error('Failed to save cohort schedules');
	}
}
