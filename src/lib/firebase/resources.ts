import { collection, addDoc, getDocs, getDoc, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '.';

export type Resource = {
	id: string;
	creatorId: string;
	title: string;
	url: string;
	type: 'youtube-video';
	tags: string[];
	cohorts?: Record<string, true>;
	createdAt: Date;
	updatedAt: Date;
};

export type CreateResource = {
	title: string;
	url: string;
	creatorId: string;
};

const resourcesRef = collection(firestore, 'resources');

export async function updateResource(id: string, data: Partial<Resource>): Promise<Resource> {
	try {
		const resourceRef = doc(firestore, 'resources', id);
		await updateDoc(resourceRef, {
			...data,
			updatedAt: new Date()
		});
		const updatedDoc = await getDoc(resourceRef);
		return {
			id: updatedDoc.id,
			...updatedDoc.data()
		} as Resource;
	} catch (error) {
		console.error('Error updating resource:', error);
		throw new Error('Failed to update resource');
	}
}

export async function getResources(): Promise<Resource[]> {
	try {
		const querySnapshot = await getDocs(resourcesRef);
		const resources: Resource[] = [];
		querySnapshot.forEach((doc) => {
			resources.push({
				id: doc.id,
				...doc.data()
			} as Resource);
		});
		return resources;
	} catch (error) {
		console.error('Error fetching resources:', error);
		throw new Error('Failed to fetch resources');
	}
}

export async function addResource(data: CreateResource): Promise<Resource> {
	const docRef = await addDoc(resourcesRef, {
		...data,
		tags: [],
		type: 'youtube-video',
		createdAt: new Date(),
		updatedAt: new Date()
	});
	return {
		id: docRef.id,
		...data,
		tags: [],
		type: 'youtube-video',
		createdAt: new Date(),
		updatedAt: new Date()
	};
}
