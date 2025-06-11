<script lang="ts">
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { firebaseAuth } from '$lib/firebase';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Loader2Icon } from '@lucide/svelte';
	import { createProfile } from '$lib/firebase/profiles';
	import { goto } from '$app/navigation';

	let email = $state('');
	let displayName = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let signupError = $state<string | null>(null);

	const handleSignup = async () => {
		signupError = null;

		if (password !== confirmPassword) {
			signupError = 'Les mots de passe ne correspondent pas';
			return;
		}

		if (password.length < 6) {
			signupError = 'Le mot de passe doit contenir au moins 6 caractères';
			return;
		}

		loading = true;
		try {
			const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

			// Create user profile
			await createProfile({
				uid: userCredential.user.uid,
				email: userCredential.user.email!,
				displayName: displayName || null,
				photoURL: userCredential.user.photoURL,
				createdAt: new Date(),
				updatedAt: new Date()
			});

			// Redirect to app after successful signup and profile creation
			goto('/app');
		} catch (error: any) {
			console.error('Signup error:', error);
			if (error.code === 'auth/email-already-in-use') {
				signupError = 'Un compte existe déjà avec cet email';
			} else {
				signupError = 'Une erreur est survenue lors de la création du compte';
			}
		} finally {
			loading = false;
		}
	};
</script>

<div>
	<Card.Root class="mx-auto mt-20 max-w-md">
		<Card.Header>
			<Card.Title>Créer un compte</Card.Title>
			<Card.Description>Entrez vos informations pour créer votre compte</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSignup();
				}}
				class="grid gap-4"
			>
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" placeholder="m@example.com" required bind:value={email} />
				</div>
				<div class="grid gap-2">
					<Label for="displayName">Nom complet</Label>
					<Input id="displayName" type="text" placeholder="John Doe" bind:value={displayName} />
				</div>
				<div class="grid gap-2">
					<Label for="password">Mot de passe</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						required
						bind:value={password}
					/>
				</div>
				<div class="grid gap-2">
					<Label for="confirm-password">Confirmer le mot de passe</Label>
					<Input
						id="confirm-password"
						type="password"
						placeholder="••••••••"
						required
						bind:value={confirmPassword}
					/>
				</div>
				{#if signupError}
					<p class="text-destructive text-sm">{signupError}</p>
				{/if}
				<Button type="submit" class="w-full" disabled={loading}>
					{#if loading}
						<Loader2Icon class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					{loading ? 'Création du compte...' : 'Créer un compte'}
				</Button>
				<div class="text-muted-foreground text-center text-sm">
					Vous avez déjà un compte ?
					<a href="/auth/login" class="text-primary hover:underline">Se connecter</a>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
