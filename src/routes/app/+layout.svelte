<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { AppSidebar } from '$lib/components/app-sidebar';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main class="grid w-full grid-rows-[auto_1fr] gap-2 p-4">
		<Sidebar.Trigger />
		{@render children?.()}
	</main>
</Sidebar.Provider>
