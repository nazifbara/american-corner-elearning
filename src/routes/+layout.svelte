<script lang="ts">
	import '../app.css';
	import { onAuthStateChanged } from 'firebase/auth';

	import { authState } from '$lib/state/shared.svelte';
	import { firebaseAuth } from '$lib/firebase';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';

	let initialized = $state(false);

	$effect(() => {
		if (browser && !initialized) {
			initialized = true;
		}

		onAuthStateChanged(firebaseAuth, (user) => {
			if (user) {
				authState.user = user;
				console.log('User is logged in', user.email);
				goto('/app');
			} else {
				authState.user = null;
				console.log('User is logged out');
				goto('/auth/login');
			}
		});
	});

	const { children } = $props();
</script>

<Toaster />
<ModeWatcher />

{@render children?.()}
