<script lang="ts">
	import '../app.css';
	import { onAuthStateChanged } from 'firebase/auth';

	import { authState } from '$lib/state/shared.svelte';
	import { firebaseAuth } from '$lib/firebase';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { getProfiles, getProfile } from '$lib/firebase/profiles';
	import { profilesState } from '$lib/state/shared.svelte';

	let initialized = $state(false);

	$effect(() => {
		if (browser && !initialized) {
			initialized = true;
		}
		getProfiles().then((profiles) => {
			profilesState.profiles = profiles;
			profilesState.loading = false;
		});

		onAuthStateChanged(firebaseAuth, async (user) => {
			if (user) {
				authState.user = user;
				authState.profile = await getProfile(user.uid);
				console.log('User is logged in', user.email);
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
