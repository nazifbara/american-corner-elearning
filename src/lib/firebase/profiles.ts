import { firestore } from '.';
import { doc, setDoc, getDoc, type DocumentReference } from 'firebase/firestore';

export interface UserProfile {
	uid: string;
	email: string;
	displayName: string | null;
	photoURL: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export async function createProfile(profile: UserProfile): Promise<void> {
	const profileRef = doc(firestore, 'profiles', profile.uid) as DocumentReference<UserProfile>;
	await setDoc(profileRef, {
		...profile,
		createdAt: new Date(),
		updatedAt: new Date()
	});
}

export async function getProfile(uid: string): Promise<UserProfile | null> {
	const profileRef = doc(firestore, 'profiles', uid) as DocumentReference<UserProfile>;
	const profile = await getDoc(profileRef);
	return profile.exists() ? (profile.data() as UserProfile) : null;
}
