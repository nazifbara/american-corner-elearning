export class EntityState<T> {
	#loading = $state(true);
	#error = $state<string | null>(null);
	#data = $state<T | null>(null);
	#fetchFn;

	constructor(fetchFn: () => Promise<T | null>) {
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
			this.#error = "Une erreur est survenue lors de la récupération de l'élément.";
		} finally {
			this.#loading = false;
		}
	}
}
