import { PUBLIC_FIREBASE_CONFIG_JSON } from '$env/static/public';

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = JSON.parse(PUBLIC_FIREBASE_CONFIG_JSON);
const provider = new GoogleAuthProvider();

provider.addScope('https://www.googleapis.com/auth/userinfo.email');

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const authProvider = provider;
