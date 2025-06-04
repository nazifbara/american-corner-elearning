<script lang="ts">
	import { onMount } from 'svelte';
	import { getCourses, type Course } from '$lib/firebase/courses';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Loader2Icon } from '@lucide/svelte';
	import NewCourse from '$lib/components/new-course/new-course.svelte';

	let courses: Course[] = $state([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			courses = await getCourses();
		} catch (error) {
			console.error('Error fetching courses:', error);
		} finally {
			loading = false;
		}
	});
</script>

<div class=" p-4">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Cours</h1>
		<NewCourse onAdd={(course) => courses.push(course)} />
	</div>

	<Separator class="my-4" />

	{#if loading}
		<div class="flex min-h-[200px] items-center justify-center">
			<Loader2Icon class="h-8 w-8 animate-spin" />
		</div>
	{:else if courses.length === 0}
		<Card.Root>
			<Card.Header>
				<Card.Title>Aucun cours disponible</Card.Title>
				<Card.Description>Commencez par créer un nouveau cours</Card.Description>
			</Card.Header>
		</Card.Root>
	{:else}
		<ul class="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(350px,0px))] gap-4">
			{#each courses as course (course.id)}
				<li>
					<a
						href="/app/courses/{course.id}"
						class="hover:bg-muted/50 block h-full rounded-lg transition-colors"
					>
						<Card.Root class="h-full">
							<Card.Header>
								<Card.Title>{course.title}</Card.Title>
								<Card.Description>{course.description}</Card.Description>
							</Card.Header>
						</Card.Root>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>
