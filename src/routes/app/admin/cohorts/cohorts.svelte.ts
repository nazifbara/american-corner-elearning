import type { Cohort } from '$lib/firebase/cohorts';

export class CohortList {
	#data = $state<Cohort[]>([]);
	#loading = $state(false);
	#adding = $state(false);
	#error = $state();
	#fetchFn;
	#addFn;

	constructor({
		fetchFn,
		addFn
	}: {
		fetchFn: () => Promise<Cohort[]>;
		addFn: () => Promise<Cohort>;
	}) {
		this.#fetchFn = fetchFn;
		this.#addFn = addFn;
	}

	get data() {
		return this.#data;
	}

	get loading() {
		return this.#loading;
	}

	get adding() {
		return this.#adding;
	}

	get error() {
		return this.#error;
	}

	async fetch() {
		try {
			this.#loading = true;
			this.#data = await this.#fetchFn();
		} catch (e) {
			console.error('Error fetching cohorts:', e);
			this.#error = 'Une erreur est survenue lors de la récupération des cohortes.';
		} finally {
			this.#loading = false;
		}
	}

	async add({ onSuccess, onError }: { onSuccess?: () => void; onError?: () => void } = {}) {
		if (this.#adding) return;

		try {
			this.#adding = true;
			const newCohort = await this.#addFn();
			this.#data.splice(0, 0, newCohort);
			onSuccess?.();
		} catch (e) {
			console.error('Error creating cohort:', e);
			onError?.();
		} finally {
			this.#adding = false;
		}
	}
}
