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
	uid: string;
	email: string;
	displayName: string | null;
	photoURL: string | null;
	courses: Record<string, true>;
	roles: string[];
	createdAt: Date;
	updatedAt: Date;
}

export function updateRoles(uid: string, roles: string[]): Promise<void> {
	const profileRef = doc(firestore, 'profiles', uid) as DocumentReference<Profile>;
	return setDoc(
		profileRef,
		{
			roles
		},
		{ merge: true }
	);
}

export async function createProfile(profile: Omit<Profile, 'roles'>): Promise<void> {
	const profileRef = doc(firestore, 'profiles', profile.uid) as DocumentReference<Profile>;
	await setDoc(profileRef, {
		...profile,
		roles: [],
		createdAt: new Date(),
		updatedAt: new Date()
	});
}

export async function getProfile(uid: string): Promise<Profile | null> {
	const profileRef = doc(firestore, 'profiles', uid) as DocumentReference<Profile>;
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
			uid: doc.id,
			...doc.data()
		} as Profile);
	});
	return profiles;
}
