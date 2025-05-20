import { PUBLIC_FIREBASE_CONFIG_JSON } from '$env/static/public';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = JSON.parse(PUBLIC_FIREBASE_CONFIG_JSON);

export const app = $state(initializeApp(firebaseConfig));
export const auth = $state(getAuth(app));
