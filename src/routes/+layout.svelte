<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { onAuthStateChanged } from 'firebase/auth';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { AppSidebar } from '$lib/components/app-sidebar';

	import { authState } from '$lib/state/shared.svelte';
	import { firebaseAuth } from '$lib/firebase';
	import { browser } from '$app/environment';

	let initialized = $state(false);

	$effect(() => {
		if (browser && !initialized) {
			initialized = true;
		}

		onAuthStateChanged(firebaseAuth, (user) => {
			if (user) {
				authState.user = user;
				console.log('User is logged in', user.email);
			} else {
				authState.user = null;
				console.log('User is logged out');
			}
		});
	});

	let { children } = $props();
</script>

<ModeWatcher />
<Sidebar.Provider>
	<AppSidebar />
	<main class="grid grid-rows-[auto_1fr] gap-2 p-4">
		<Sidebar.Trigger />
		{@render children?.()}
	</main>
</Sidebar.Provider>
