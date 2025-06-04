<script lang="ts">
	import { onMount } from 'svelte';

	import { getCourses, type Course } from '$lib/firebase/courses';
	import { Separator } from '$lib/components/ui/separator';

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

<div class="container mx-auto">
	<NewCourse onAdd={(course) => courses.push(course)} />
	<Separator class="my-4" />

	<h1 class="mb-4 text-2xl font-bold">Cours</h1>
	{#if loading}
		<p>Chargement des cours...</p>
	{:else if courses.length === 0}
		<p>No courses available.</p>
	{:else}
		<ul class="list-disc pl-5">
			{#each courses as course (course.id)}
				<li>{course.title}: {course.description}</li>
			{/each}
		</ul>
	{/if}
</div>
