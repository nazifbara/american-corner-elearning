<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import AgoraRTC from 'agora-rtc-sdk-ng';
	import { Button } from '$lib/components/ui/button';
	import { PUBLIC_AGORA_APP_ID } from '$env/static/public';
	import { Loader2Icon } from '@lucide/svelte';

	type Props = {
		channelName: string;
		userId: string;
	};

	const { channelName, userId }: Props = $props();

	const appId = PUBLIC_AGORA_APP_ID;

	let [localAudioTrack, localVideoTrack]:
		| Awaited<Promise<ReturnType<typeof AgoraRTC.createMicrophoneAndCameraTracks>>>
		| [null, null] = $state([null, null]);
	let client: ReturnType<typeof AgoraRTC.createClient> | null = $state(null);
	let joined = $state(false);
	let joining = $state(false);
	let token: string | null = null;

	// Create DOM elements for video streams
	let localVideoContainer: HTMLElement | undefined = $state(undefined);
	let remoteVideoContainer: HTMLElement | undefined = $state(undefined);

	onMount(async () => {
		client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

		// Listen for remote users joining
		client.on('user-published', async (user: any, mediaType: string) => {
			if (!client) return;
			await client.subscribe(user, mediaType as 'video');
			if (mediaType === 'video') {
				const playerElement = document.createElement('div');
				playerElement.className = 'aspect-video overflow-hidden rounded-lg';
				playerElement.id = user.uid;
				remoteVideoContainer && remoteVideoContainer.appendChild(playerElement);
				user.videoTrack.play(playerElement);
			}
			if (mediaType === 'audio') {
				user.audioTrack.play();
			}
		});

		// Handle remote user leaving
		client.on('user-unpublished', (user: any) => {
			const playerElement = document.getElementById(user.uid);
			if (playerElement) {
				playerElement.remove();
			}
		});
	});

	onDestroy(async () => {
		if (localAudioTrack) {
			localAudioTrack.close();
		}
		if (localVideoTrack) {
			localVideoTrack.close();
		}
		await client?.leave();
	});

	async function getToken() {
		try {
			const response = await fetch('/api/agora-token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					channelName,
					uid: userId
				})
			});

			if (!response.ok) {
				throw new Error('Failed to get token');
			}

			const data = await response.json();
			return data.token;
		} catch (error) {
			console.error('Error getting token:', error);
			return null;
		}
	}

	async function joinChannel() {
		joining = true;

		if (!client) {
			console.error('Agora client is not initialized');
			return;
		}

		try {
			// Get token before joining
			token = await getToken();
			if (!token) {
				throw new Error('Failed to get token');
			}

			// Join the channel with token
			await client.join(appId, channelName, token, userId);
			joined = true;

			// Create and publish local tracks
			[localAudioTrack, localVideoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
			await client.publish([localAudioTrack, localVideoTrack]);

			// Play local video
			localVideoContainer && localVideoTrack.play(localVideoContainer);
		} catch (error) {
			console.error('Error joining channel:', error);
		} finally {
			joining = false;
		}
	}

	async function leaveChannel() {
		if (localAudioTrack) {
			localAudioTrack.close();
		}
		if (localVideoTrack) {
			localVideoTrack.close();
		}
		client && (await client.leave());
		joined = false;
		token = null;
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex justify-end gap-2">
		{#if !joined}
			<Button onclick={joinChannel} disabled={joining}>
				{#if joining}
					<Loader2Icon size={20} class="animate-spin" />
				{/if}
				Rejoindre la conférence
			</Button>
		{:else}
			<Button variant="destructive" onclick={leaveChannel}>Quitter la conférence</Button>
		{/if}
	</div>

	<div
		class="grid grid-cols-[repeat(auto-fit,minmax(350px,0px))] gap-2"
		bind:this={remoteVideoContainer}
	>
		<div bind:this={localVideoContainer} class="aspect-video max-w-sm overflow-hidden rounded-lg">
			<!-- Local video will be rendered here -->
		</div>
	</div>
</div>
