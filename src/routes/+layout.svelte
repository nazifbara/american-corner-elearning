<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';

	import { Button } from '$lib/components/ui/button';

	let { children } = $props();
</script>

<ModeWatcher />

<div class="mx-auto grid w-full max-w-4xl grid-cols-[30%_1fr] gap-4 px-2 py-4">
	<aside>
		<Button>Créer un cours +</Button>
		<ul class="grid gap-2 py-4">
			<li><a href="/#">Cour 1</a></li>
			<li><a href="/#">Cour 2</a></li>
			<li><a href="/#">Cour 3</a></li>
		</ul>
	</aside>
	<main>
		{@render children()}
	</main>
</div>
