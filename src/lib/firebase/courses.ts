import { firestore } from '$lib/firebase';
import {
	collection,
	getDocs,
	addDoc,
	doc,
	getDoc,
	updateDoc,
	where,
	query,
	onSnapshot
} from 'firebase/firestore';

export type Course = {
	id: string;
	userId: string; // Creator of the course
	title: string;
	description: string;
	participants: Record<string, true>;
	startedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
};

export type CourseData = Omit<
	Course,
	'id' | 'startedAt' | 'createdAt' | 'updatedAt' | 'participants'
>;

const courseRef = collection(firestore, 'courses');
export async function addCourse(data: CourseData): Promise<Course> {
	try {
		const newCourse = {
			...data,
			createdAt: new Date(),
			updatedAt: new Date(),
			participants: {}
		};
		const docRef = await addDoc(collection(firestore, 'courses'), newCourse);
		return { id: docRef.id, startedAt: null, ...newCourse };
	} catch (error) {
		console.error('Error adding course:', error);
		throw new Error('Failed to add course');
	}
}

export async function getCourses(): Promise<Course[]> {
	try {
		const querySnapshot = await getDocs(courseRef);
		const courses: Course[] = [];
		querySnapshot.forEach((doc) => {
			courses.push({
				id: doc.id,
				...doc.data()
			} as Course);
		});
		return courses;
	} catch (error) {
		console.error('Error fetching courses:', error);
		throw new Error('Failed to fetch courses');
	}
}

export async function getCourse(courseId: string): Promise<Course | null> {
	try {
		const docRef = doc(firestore, 'courses', courseId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			return {
				id: docSnap.id,
				...docSnap.data()
			} as Course;
		} else {
			return null;
		}
	} catch (error) {
		console.error('Error fetching course:', error);
		throw new Error('Failed to fetch course');
	}
}

export async function getMyCourses(userId: string): Promise<Course[]> {
	try {
		const q = query(courseRef, where('userId', '==', userId));
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map(
			(doc) =>
				({
					id: doc.id,
					...doc.data()
				}) as Course
		);
	} catch (error) {
		console.error('Error fetching my courses:', error);
		throw new Error('Failed to fetch my courses');
	}
}

export async function getParticipatingCourses(userId: string): Promise<Course[]> {
	try {
		const q = query(courseRef, where(`participants.${userId}`, '==', true));
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map(
			(doc) =>
				({
					id: doc.id,
					...doc.data()
				}) as Course
		);
	} catch (error) {
		console.error('Error fetching participating courses:', error);
		throw new Error('Failed to fetch participating courses');
	}
}

export async function startCourse(courseId: string): Promise<void> {
	try {
		const courseRef = doc(firestore, 'courses', courseId);
		await updateDoc(courseRef, {
			startedAt: new Date()
		});
	} catch (error) {
		console.error('Error starting course:', error);
		throw new Error('Failed to start course');
	}
}

export async function endCourse(courseId: string): Promise<void> {
	try {
		const courseRef = doc(firestore, 'courses', courseId);
		await updateDoc(courseRef, {
			startedAt: null
		});
	} catch (error) {
		console.error('Error ending course:', error);
		throw new Error('Failed to end course');
	}
}

export function subscribeToCourse(courseId: string, callback: (course: Course | null) => void) {
	const courseRef = doc(firestore, 'courses', courseId);
	return onSnapshot(courseRef, (snapshot) => {
		if (snapshot.exists()) {
			callback({
				id: snapshot.id,
				...snapshot.data()
			} as Course);
		} else {
			callback(null);
		}
	});
}
