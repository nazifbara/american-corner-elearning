<script lang="ts">
	import { onMount } from 'svelte';
	import { PlusIcon } from '@lucide/svelte';

	import { getCourses, type Course } from '$lib/firebase/courses';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';

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

<div class="container mx-auto p-4">
	<Dialog.Root>
		<Dialog.Trigger>
			<Button><PlusIcon /> Ajouter un cours</Button>
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-lg">
			<Dialog.Header>
				<Dialog.Title>Ajouter un cours</Dialog.Title>
				<Dialog.Description>Ajouter un nouveau cours</Dialog.Description>
			</Dialog.Header>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="self-start text-right">Titre</Label>
				<Input id="name" class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center justify-start gap-4">
				<Label for="username" class="self-start text-right">Description</Label>
				<Textarea id="description" class="col-span-3 h-32" />
			</div>
			<Dialog.Footer>
				<Button type="submit">Ajouter</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<h1 class="mb-4 text-2xl font-bold">Courses</h1>
	{#if loading}
		<p>Loading courses...</p>
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
