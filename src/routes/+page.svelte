<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { onAuthStateChanged } from 'firebase/auth';

	import { authState } from '$lib/state/shared.svelte';
	import { firebaseAuth } from '$lib/firebase';
	import { Toaster } from '$lib/components/ui/sonner';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	let initialized = $state(false);

	$effect(() => {
		if (browser && !initialized) {
			initialized = true;
		}

		onAuthStateChanged(firebaseAuth, (user) => {
			if (user) {
				authState.user = user;
				console.log('User is logged in', user.email);
				goto('/app/courses');
			} else {
				authState.user = null;
				goto('/auth/login');
			}
		});
	});

	let { children } = $props();
</script>

<ModeWatcher />
<Toaster />

{@render children?.()}
