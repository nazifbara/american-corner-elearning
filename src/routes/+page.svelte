<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';

	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();
</script>

<ModeWatcher />
<Toaster />

{@render children?.()}
