import { getCoaches, type Profile } from '$lib/firebase/profiles';
import type { User } from 'firebase/auth';
import { EntityList } from './entity-list-state.svelte';

type AuthState = {
	user: User | null;
	profile: Profile | null;
	loading: boolean;
};

type ProfilesState = {
	loading: boolean;
	profiles: Profile[];
};

class CoachList extends EntityList<Profile> {
	#initialized = $state(false);

	get data() {
		if (!this.#initialized) {
			throw new Error('Coaches not initialized. Call fetch() first.');
		}
		return super.data;
	}

	get initialized() {
		return this.#initialized;
	}

	reset = () => {
		this.#initialized = false;
	};

	fetch = async () => {
		if (this.loading || this.#initialized) return;
		await super.fetch();
		this.#initialized = true;
	};
}

export const authState: AuthState = $state({ user: null, profile: null, loading: true });
const isAdmin = $derived(authState.profile ? authState.profile.roles.includes('admin') : false);
export const checkAdmin = () => isAdmin;

export const profilesState: ProfilesState = $state({ loading: true, profiles: [] });

export const coachList = $state(new CoachList({ fetchFn: getCoaches }));
