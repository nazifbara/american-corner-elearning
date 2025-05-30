// See https://svelte.dev/docs/kit/types#app.d.ts

import type { App as FirebaseApp } from 'firebase-admin/app';
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			firebaseApp: FirebaseApp;
			firebaseAuth: Auth;
			firestore: Firestore;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
