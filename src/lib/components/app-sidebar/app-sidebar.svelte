<script lang="ts">
	import { BookIcon, CircleUserIcon, SettingsIcon, LogOutIcon } from '@lucide/svelte';
	import { firebaseAuth } from '$lib/firebase';
	import { page } from '$app/state';

	import * as Sidebar from '$lib/components/ui/sidebar';

	const baseUrl = '/app';

	const items = [
		{
			title: 'Cours',
			url: `${baseUrl}/courses`,
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
							<Sidebar.MenuButton isActive={page.url.pathname === item.url}>
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
				<Sidebar.MenuButton onclick={handleLogout}>
					<LogOutIcon />
					<span>Déconnexion</span>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
