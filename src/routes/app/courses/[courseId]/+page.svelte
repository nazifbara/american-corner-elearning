<script lang="ts">
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { getCourse, type Course } from '$lib/firebase/courses';
	import { Loader2Icon } from '@lucide/svelte';

	const courseId = page.params.courseId;
	let course: Course | null = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	$effect(() => {
		loadCourse();
	});

	async function loadCourse() {
		try {
			course = await getCourse(courseId);
			if (!course) {
				error = 'Cours non trouvé';
			}
		} catch (e) {
			console.error('Error loading course:', e);
			error = "Une erreur s'est produite lors du chargement du cours";
		} finally {
			loading = false;
		}
	}
</script>

<div class="container mx-auto p-4">
	{#if loading}
		<div class="flex min-h-[200px] items-center justify-center">
			<Loader2Icon class="h-8 w-8 animate-spin" />
		</div>
	{:else if error}
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-destructive">{error}</Card.Title>
			</Card.Header>
			<Card.Content>
				<Button href="/app/courses" variant="outline">Retour aux cours</Button>
			</Card.Content>
		</Card.Root>
	{:else if course}
		<Card.Root>
			<Card.Header>
				<Card.Title>{course.title}</Card.Title>
				<Card.Description>{course.description}</Card.Description>
			</Card.Header>
			<Card.Content>
				<!-- Course content will go here -->
			</Card.Content>
			<Card.Footer class="flex justify-between">
				<Button href="/app/courses" variant="outline">Retour aux cours</Button>
			</Card.Footer>
		</Card.Root>
	{/if}
</div>
