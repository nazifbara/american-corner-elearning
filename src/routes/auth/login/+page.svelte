<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authState } from '$lib/state/shared.svelte';
	import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
	import * as Card from '$lib/components/ui/card';
	import { firebaseAuth, authProvider } from '$lib/firebase';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Loader2Icon } from '@lucide/svelte';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let loginError = $state<string | null>(null);

	onMount(() => {
		// Redirect to the courses page if the user is logged in
		if (authState.user) {
			goto('/app/courses');
		}
	});

	async function handleLoginWithEmail() {
		loading = true;
		loginError = null;
		if (!email || !password) {
			loginError = 'Email et mot de passe requis.';
			loading = false;
			return;
		}

		try {
			await signInWithEmailAndPassword(firebaseAuth, email, password);
		} catch (error) {
			console.error('Error logging in with email:', error);
			loginError = 'Échec de la connexion. Veuillez vérifier vos identifiants.';
		} finally {
			loading = false;
		}
	}

	async function handleLoginWithGoogle() {
		try {
			loading = true;
			await signInWithPopup(firebaseAuth, authProvider);
		} catch (error) {
			console.error('Error logging in with Google:', error);
			loginError = 'Échec de la connexion Google. Veuillez réessayer.';
		} finally {
			loading = false;
		}
	}
</script>

<div>
	<Card.Root class="mx-auto mt-20 max-w-md">
		<Card.Header>
			<Card.Title>Bienvenue</Card.Title>
			<Card.Description>Veuillez vous connecter pour continuer</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				class="grid gap-4"
				onsubmit={(e) => {
					e.preventDefault();
					handleLoginWithEmail();
				}}
			>
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="Entrez votre email"
						bind:value={email}
						required
					/>
				</div>
				<div class="grid gap-2">
					<Label for="password">Mot de passe</Label>
					<Input
						id="password"
						type="password"
						placeholder="Entrez votre mot de passe"
						bind:value={password}
						required
					/>
				</div>
				<Button type="submit" disabled={loading}>
					{#if loading}
						<Loader2Icon class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Se connecter
				</Button>
				{#if loginError}
					<p class="text-destructive text-sm">{loginError}</p>
				{/if}
				<div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
					<Separator />
					<p class="text-muted-foreground text-sm">Ou continuer avec</p>
					<Separator />
				</div>
				<Button variant="outline" disabled={loading} onclick={handleLoginWithGoogle}>Google</Button>
				<div class="text-muted-foreground text-center text-sm">
					Vous n'avez pas de compte ?
					<a href="/auth/signup" class="text-primary hover:underline">S'inscrire</a>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
