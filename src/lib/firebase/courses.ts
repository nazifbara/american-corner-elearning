import { firestore } from '$lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export type Course = {
	id: string;
	title: string;
	description: string;
};

const courseRef = collection(firestore, 'courses');

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
