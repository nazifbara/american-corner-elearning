<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';
</script>

<ul>
	<li><Button variant="link" href="{page.url.pathname}/cohorts">Cohortes</Button></li>
</ul>
