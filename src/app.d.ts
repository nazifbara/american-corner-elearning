// See https://svelte.dev/docs/kit/types#app.d.ts

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			firebaseApp: FirebaseApp;
			firebaseAuth: Auth;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
