<script lang="ts">
	import {
		BookIcon,
		CircleUserIcon,
		SettingsIcon,
		LogOutIcon,
		BoxesIcon,
		BoxIcon,
		UsersIcon
	} from '@lucide/svelte';
	import { firebaseAuth } from '$lib/firebase';
	import { authState, checkAdmin } from '$lib/state/shared.svelte';
	import { page } from '$app/state';

	import * as Sidebar from '$lib/components/ui/sidebar';

	const baseUrl = '/app';

	const appitems = [
		{
			title: 'Mes cohortes',
			url: `${baseUrl}/cohorts`,
			icon: BoxIcon
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

	const adminItems = [
		{
			title: 'Cohortes',
			url: `${baseUrl}/admin/cohorts`,
			icon: BoxesIcon
		},
		{
			title: 'Utilisateurs',
			url: `${baseUrl}/admin/users`,
			icon: UsersIcon
		}
	];

	async function handleLogout() {
		await firebaseAuth.signOut();
	}
</script>

<Sidebar.Root>
	<Sidebar.Content>
		{#if ['student', 'coach'].includes(authState.profile?.roles[0] ?? '')}
			<Sidebar.Group>
				<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each appitems as item (item.title)}
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
		{/if}

		{#if authState.profile?.roles.includes('admin')}
			<Sidebar.Group>
				<Sidebar.GroupLabel>Administration</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each adminItems as item (item.title)}
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
		{/if}
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
