<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { PenIcon, Loader2Icon } from '@lucide/svelte';
	import { MAX_NUM_MEMBERS } from '$lib/config';
	import { MembersManager } from './members-manager';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { Profile } from '$lib/firebase/profiles';
	import { getProfile } from '$lib/firebase/profiles';

	type Props = {
		cohortId: string;
		members: Record<string, true>;
	};
	let { cohortId, members }: Props = $props();
	let numMembers = $derived(Object.keys(members).length);
	let membersProfiles = $state<Record<string, Profile | null>>({});
	let loading = $state(false);
	let error = $state<string | null>(null);
	let initialized = $state(false);

	$effect(() => {
		if (initialized) {
			members = Object.fromEntries(
				Object.entries(membersProfiles).map(([id, profile]) => [id, true])
			);
		}
	});

	async function loadMembers() {
		try {
			loading = true;
			const memberIds = Object.keys(members);
			console.log('Loading members for cohort:', cohortId, 'Member IDs:', memberIds);
			const profiles = await Promise.all(
				memberIds.map(async (id) => {
					const profile = await getProfile(id);
					return [id, profile] as const;
				})
			);

			membersProfiles = Object.fromEntries(profiles);
			initialized = true;
		} catch (e) {
			console.error('Error loading members:', e);
			error = "Une erreur s'est produite lors du chargement des membres";
		} finally {
			loading = false;
		}
	}
</script>

<Dialog.Root
	onOpenChange={(open) => {
		if (open) {
			loadMembers();
		}
	}}
>
	<Dialog.Trigger>
		<Button variant="outline" size="sm">
			<PenIcon class="mr-1" />
			{numMembers} / {MAX_NUM_MEMBERS}
		</Button>
	</Dialog.Trigger>
	<Dialog.Content class="w-dvw">
		<Dialog.Header>
			<Dialog.Title>Gérer les participants</Dialog.Title>
			<Dialog.Description>Gérez les participants de cette cohorte.</Dialog.Description>
		</Dialog.Header>
		{#if loading}
			<div class="flex min-h-[200px] items-center justify-center">
				<Loader2Icon class="h-8 w-8 animate-spin" />
			</div>
		{:else if error}
			<div class="text-destructive text-sm">{error}</div>
		{:else}
			<div class="grid grid-cols-[1fr_auto_1fr] gap-2">
				<div class="divide-y">
					{#each Object.entries(membersProfiles) as [userId, profile]}
						<div class="flex items-center justify-between py-2">
							<div class="flex items-center gap-2">
								<div>
									<p class="font-medium">
										{profile?.displayName || profile?.email || 'Utilisateur inconnu'}
									</p>
									{#if profile?.email}
										<p class="text-muted-foreground text-sm">{profile.email}</p>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
				<Separator orientation="vertical" />
				<MembersManager {cohortId} bind:members={membersProfiles} />
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
