export class EntityList<T> {
	#data = $state<T[]>([]);
	#loading = $state(false);
	#adding = $state(false);
	#error = $state();
	#fetchFn?: () => Promise<T[]>;
	#addFn;

	constructor({ fetchFn, addFn }: { fetchFn?: () => Promise<T[]>; addFn?: () => Promise<T> }) {
		this.#fetchFn = fetchFn;
		this.#addFn = addFn;
	}

	set fetchFn(fn: () => Promise<T[]>) {
		this.#fetchFn = fn;
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
		if (!this.#fetchFn) {
			throw new Error('Fetch function is not defined');
		}
		try {
			this.#loading = true;
			this.#data = await this.#fetchFn();
		} catch (e) {
			console.error('Error fetching items:', e);
			this.#error = 'Une erreur est survenue lors de la récupération des éléments.';
		} finally {
			this.#loading = false;
		}
	}

	async add({ onSuccess, onError }: { onSuccess?: () => void; onError?: () => void } = {}) {
		if (this.#adding || !this.#addFn) return;

		try {
			this.#adding = true;
			const newItem = await this.#addFn();
			this.#data.splice(0, 0, newItem);
			onSuccess?.();
		} catch (e) {
			console.error('Error creating item:', e);
			onError?.();
		} finally {
			this.#adding = false;
		}
	}
}
