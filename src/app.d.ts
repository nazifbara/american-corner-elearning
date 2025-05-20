// See https://svelte.dev/docs/kit/types#app.d.ts

import type { FirebaseApp } from 'firebase/app';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			firebaseApp: FirebaseApp;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
