import { firestore } from '.';
import {
	doc,
	setDoc,
	getDoc,
	getDocs,
	where,
	query,
	type DocumentReference,
	collection
} from 'firebase/firestore';

export interface Profile {
	id: string;
	email: string;
	displayName: string;
	photoURL: string | null;
	courses: Record<string, true>;
	cohorts: Record<string, true>;
	assignedCohorts: Record<string, true>;
	roles: string[];
	createdAt: Date;
	updatedAt: Date;
}

export function updateRoles(id: string, roles: string[]): Promise<void> {
	const profileRef = doc(firestore, 'profiles', id) as DocumentReference<Profile>;
	return setDoc(
		profileRef,
		{
			roles
		},
		{ merge: true }
	);
}

export async function createProfile(profile: Omit<Profile, 'roles'>): Promise<void> {
	const profileRef = doc(firestore, 'profiles', profile.id) as DocumentReference<Profile>;
	await setDoc(profileRef, {
		...profile,
		roles: [],
		createdAt: new Date(),
		updatedAt: new Date()
	});
}

export async function getProfile(id: string): Promise<Profile | null> {
	const profileRef = doc(firestore, 'profiles', id) as DocumentReference<Profile>;
	const profile = await getDoc(profileRef);
	return profile.exists() ? (profile.data() as Profile) : null;
}

// get list of profiles
export async function getProfiles(except: string[] = []): Promise<Profile[]> {
	const profiles: Profile[] = [];

	const profilesRef = collection(firestore, 'profiles');
	const q = query(profilesRef, where('uid', 'not-in', except));
	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		profiles.push({
			id: doc.id,
			...doc.data()
		} as Profile);
	});
	return profiles;
}

export async function getStudents(): Promise<Profile[]> {
	const profiles: Profile[] = [];

	const profilesRef = collection(firestore, 'profiles');
	const q = query(profilesRef, where('roles', 'array-contains', 'student'));
	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		profiles.push({
			id: doc.id,
			...doc.data()
		} as Profile);
	});
	return profiles;
}

export async function getCoaches(): Promise<Profile[]> {
	const profiles: Profile[] = [];

	const profilesRef = collection(firestore, 'profiles');
	const q = query(profilesRef, where('roles', 'array-contains', 'coach'));
	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		profiles.push({
			id: doc.id,
			...doc.data()
		} as Profile);
	});
	return profiles;
}
