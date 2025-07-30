export class EntityList<T extends { id: string }> {
	#data = $state<T[]>([]);
	#loading = $state(false);
	#adding = $state(false);
	#updating = $state(false);
	#error = $state();
	#fetchFn?: () => Promise<T[]>;
	#addFn;
	#updateFn?: (id: string, item: Partial<T>) => Promise<T>;

	constructor({
		fetchFn,
		addFn,
		updateFn
	}: {
		fetchFn?: () => Promise<T[]>;
		addFn?: () => Promise<T>;
		updateFn?: (id: string, item: Partial<T>) => Promise<T>;
	} = {}) {
		this.#fetchFn = fetchFn;
		this.#addFn = addFn;
		this.#updateFn = updateFn;
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

	get updating() {
		return this.#updating;
	}

	get error() {
		return this.#error;
	}

	async update(
		id: string,
		item: Partial<T>,
		{ onSuccess, onError }: { onSuccess?: () => void; onError?: () => void } = {}
	) {
		if (!this.#updateFn) {
			throw new Error('Update function is not defined');
		}
		try {
			this.#updating = true;
			const updatedItem = await this.#updateFn(id, item);
			const index = this.#data.findIndex((i) => i.id === updatedItem.id);
			if (index !== -1) {
				this.#data[index] = updatedItem;
			}
			onSuccess?.();
		} catch (e) {
			console.error('Error updating item:', e);
			this.#error = "Une erreur est survenue lors de la mise à jour de l'élément.";
			onError?.();
		} finally {
			this.#updating = false;
		}
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
