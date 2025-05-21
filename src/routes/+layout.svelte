<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { onAuthStateChanged, signInWithPopup, getRedirectResult } from 'firebase/auth';

	import { authState } from '$lib/state/shared.svelte';
	import { firebaseAuth, authProvider } from '$lib/firebase';
	import { Button } from '$lib/components/ui/button';
	import { browser } from '$app/environment';

	let initialized = $state(false);
	let authLoading = $state(false);

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

	async function handleLogin() {
		authLoading = true;
		await signInWithPopup(firebaseAuth, authProvider);
		authLoading = false;
	}

	async function handleLogout() {
		await firebaseAuth.signOut();
	}

	let { children } = $props();
</script>

<ModeWatcher />

<div class="mx-auto grid w-full max-w-4xl grid-cols-[30%_1fr] gap-4 px-2 py-4">
	<aside class="grid gap-2">
		{#if authState.user}
			<Button onclick={handleLogout}>Logout</Button>
		{:else}
			<Button onclick={handleLogin}>Login</Button>
		{/if}
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
