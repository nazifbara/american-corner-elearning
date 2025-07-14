import { getCoaches, type Profile } from '$lib/firebase/profiles';
import type { User } from 'firebase/auth';
import { ListHandler } from './list-handler.svelte';

type AuthState = {
	user: User | null;
};

type ProfilesState = {
	loading: boolean;
	profiles: Profile[];
};

class CoachList extends ListHandler<Profile> {
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

export const authState: AuthState = $state({ user: null });

export const profilesState: ProfilesState = $state({ loading: true, profiles: [] });

export const coachList = $state(new CoachList({ fetchFn: getCoaches }));
