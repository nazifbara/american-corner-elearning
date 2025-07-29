import { collection, addDoc, getDocs } from 'firebase/firestore';
import { firestore } from '.';

export type Resource = {
	id: string;
	creatorId: string;
	title: string;
	url: string;
	type: 'youtube-video';
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
};

export type CreateResource = {
	title: string;
	url: string;
	creatorId: string;
};

const resourcesRef = collection(firestore, 'resources');

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
