import type { User } from 'firebase/auth';

type AuthState = {
	user: User | null;
};

export const authState: AuthState = $state({ user: null });
