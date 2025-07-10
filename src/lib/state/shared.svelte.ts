import { getCoaches, type Profile } from '$lib/firebase/profiles';
import type { User } from 'firebase/auth';

type AuthState = {
	user: User | null;
};

type ProfilesState = {
	loading: boolean;
	profiles: Profile[];
};

class CoachList {
	#coaches: Profile[] = $state([]);
	#loading = $state(false);
	#initialized = false;
	#error = '';
	#fetcherFn;

	constructor(fetcherFn: () => Promise<Profile[]>) {
		this.#fetcherFn = fetcherFn;
	}

	get coaches() {
		if (!this.#initialized) {
			throw new Error('Coaches not initialized. Call fetchCoaches() first.');
		}
		return this.#coaches;
	}

	get loading() {
		return this.#loading;
	}

	get error() {
		return this.#error;
	}

	reset = () => {
		this.#initialized = false;
	};

	fetch = async () => {
		if (this.#loading || this.#initialized) return;

		this.#loading = true;
		try {
			const coaches = await this.#fetcherFn();
			this.#coaches = coaches;
			this.#initialized = true;
		} catch (error) {
			console.error('Error fetching coaches:', error);
			this.#error = error instanceof Error ? error.message : String(error);
		} finally {
			this.#loading = false;
		}
	};
}

export const authState: AuthState = $state({ user: null });

export const profilesState: ProfilesState = $state({ loading: true, profiles: [] });

export const coachList = $state(new CoachList(getCoaches));
