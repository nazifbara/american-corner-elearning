import { firestore } from '$lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export type Course = {
	id: string;
	userId: string;
	title: string;
	description: string;
};

const courseRef = collection(firestore, 'courses');
export async function addCourse(course: Omit<Course, 'id'>): Promise<Course> {
	try {
		const docRef = await addDoc(collection(firestore, 'courses'), course);
		return { id: docRef.id, ...course };
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
