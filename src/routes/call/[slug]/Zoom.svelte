<!-- <script lang="ts">
	import { onMount } from 'svelte';
	import ZoomVideo, { type VideoPlayer, VideoQuality } from '@zoom/videosdk';

	type Props = {
		JWT: string;
		slug: string;
	};
	const { JWT, slug }: Props = $props();

	const username = `User-${String(new Date().getTime()).slice(6)}`;
	const client = ZoomVideo.createClient();
	let videoContainer: HTMLElement | undefined = $state(undefined);
	let inSession = $state(false);
	let audioMuted = $state(false);
	let videoMuted = $state(false);

	onMount(async () => {
		await client.init('en-US', 'Global', { patchJsMedia: true });
	});
</script> -->
