<script lang="ts">
	import { BookIcon, CircleUserIcon, SettingsIcon, LogInIcon, LogOutIcon } from '@lucide/svelte';
	import { signInWithPopup } from 'firebase/auth';
	import { firebaseAuth, authProvider } from '$lib/firebase';
	import { authState } from '$lib/state/shared.svelte';

	import * as Sidebar from '$lib/components/ui/sidebar';

	const items = [
		{
			title: 'Cours',
			url: '#',
			icon: BookIcon
		},
		{
			title: 'Profile',
			url: '#',
			icon: CircleUserIcon
		},
		{
			title: 'Configuration',
			url: '#',
			icon: SettingsIcon
		}
	];

	async function handleLogin() {
		const result = await signInWithPopup(firebaseAuth, authProvider);
		console.log({ result });
	}

	async function handleLogout() {
		await firebaseAuth.signOut();
	}
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				{#if authState.user}
					<Sidebar.MenuButton onclick={handleLogout}>
						<LogOutIcon />
						<span>Déconnexion</span>
					</Sidebar.MenuButton>
				{:else}
					<Sidebar.MenuButton onclick={handleLogin}>
						<LogInIcon />
						<span>Connexion avec Google</span>
					</Sidebar.MenuButton>
				{/if}
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
