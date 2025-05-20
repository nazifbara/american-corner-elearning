import { PUBLIC_FIREBASE_CONFIG_JSON } from '$env/static/public';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = JSON.parse(PUBLIC_FIREBASE_CONFIG_JSON);

export async function handle({ event, resolve }) {
	// Initialize Firebase
	const app = initializeApp(firebaseConfig);

	event.locals.firebaseApp = app;
	event.locals.firebaseAuth = getAuth(app);

	return await resolve(event);
}
