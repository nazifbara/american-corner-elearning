<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Pen, PenIcon } from '@lucide/svelte';
	import { MAX_NUM_PARTICIPANTS } from '$lib/config';

	type Props = {
		cohortId: string;
		participants: Record<string, true>;
	};
	let { cohortId, participants }: Props = $props();
	let participantsCount = Object.keys(participants).length;
</script>

<Button variant="outline" size="sm">
	<PenIcon class="mr-1" />
	{participantsCount} / {MAX_NUM_PARTICIPANTS} participants
</Button>
