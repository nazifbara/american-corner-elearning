import { PRIVATE_FIREBASE_PRIVATE_KEY } from '$env/static/private';
import { PUBLIC_FIREBASE_CLIENT_EMAIL, PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export async function handle({ event, resolve }) {
	if (getApps().length === 0) {
		event.locals.firebaseApp = initializeApp({
			credential: cert({
				projectId: PUBLIC_FIREBASE_PROJECT_ID,
				clientEmail: PUBLIC_FIREBASE_CLIENT_EMAIL,
				privateKey: PRIVATE_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
			})
		});
	}

	event.locals.firebaseAuth = getAuth();
	event.locals.firestore = getFirestore(event.locals.firebaseApp);

	return await resolve(event);
}
