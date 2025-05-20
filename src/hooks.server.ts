import { initializeApp } from 'firebase/app';
import { PUBLIC_FIREBASE_CONFIG_JSON } from '$env/static/public';

const firebaseConfig = JSON.parse(PUBLIC_FIREBASE_CONFIG_JSON);

export async function handle({ event, resolve }) {
	// Initialize Firebase
	const app = initializeApp(firebaseConfig);

	event.locals.firebaseApp = app;

	return await resolve(event);
}
