import type { Cohort } from '$lib/firebase/cohorts';

export class CohortState {
	#loading = $state(true);
	#error = $state<string | null>(null);
	#data = $state<Cohort | null>(null);
	#fetchFn;

	constructor(fetchFn: () => Promise<Cohort | null>) {
		this.#fetchFn = fetchFn;
		this.fetch();
	}

	get loading() {
		return this.#loading;
	}

	get error() {
		return this.#error;
	}

	get data() {
		return this.#data;
	}

	async fetch() {
		try {
			this.#loading = true;
			this.#data = await this.#fetchFn();
		} catch (error) {
			console.error(error);
			this.#error = "Une erreur s'est produite lors de la récupération de la cohorte.";
		} finally {
			this.#loading = false;
		}
	}
}
