import type { Profile } from '$lib/firebase/profiles';
import type { User } from 'firebase/auth';

type AuthState = {
	user: User | null;
};

type ProfilesState = {
	loading: boolean;
	profiles: Profile[];
};

export const authState: AuthState = $state({ user: null });

export const profilesState: ProfilesState = $state({ loading: true, profiles: [] });
