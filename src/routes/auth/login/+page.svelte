<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authState } from '$lib/state/shared.svelte';
	import { signInWithPopup } from 'firebase/auth';
	import * as Card from '$lib/components/ui/card';
	import { firebaseAuth, authProvider } from '$lib/firebase';
	import { Button } from '$lib/components/ui/button';

	onMount(() => {
		// Redirect to the courses page if the user is logged in
		if (authState.user) {
			goto('/app/courses');
		}
	});

	async function handleLoginWithGoogle() {
		const result = await signInWithPopup(firebaseAuth, authProvider);
		console.log({ result });
	}
</script>

<div>
	<Card.Root class="mx-auto mt-20 max-w-md">
		<Card.Header>
			<Card.Title>Bienvenue sur l'application</Card.Title>
			<Card.Description>Veuillez vous connecter pour continuer.</Card.Description>
		</Card.Header>
		<Card.Content>
			<Button onclick={handleLoginWithGoogle}>Se connecter avec Google</Button>
		</Card.Content>
	</Card.Root>
</div>
