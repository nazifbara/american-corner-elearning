<script lang="ts">
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { getCourse, type Course } from '$lib/firebase/courses';
	import { getProfile, type Profile } from '$lib/firebase/profiles';
	import { Loader2Icon } from '@lucide/svelte';
	import { VideoConference } from '$lib/components/video-conference';
	import { CourseParticipants } from '$lib/components/course-participants';
	import { authState } from '$lib/state/shared.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { subscribeToCourse } from '$lib/firebase/courses';

	const courseId = page.params.courseId;
	let course: Course | null = $state(null);
	let initialCourse: Course | null = $state(null);
	let loading = $state(true);
	let creator = $state<Profile | null>(null);
	let error = $state<string | null>(null);
	let unsubscribe: (() => void) | null = null;
	let allowedUserIds = $derived.by(() => {
		return [authState.user!.uid, ...Object.keys(course?.participants || {})];
	});

	onMount(() => {
		// Subscribe to real-time course updates
		unsubscribe = subscribeToCourse(courseId, async (updatedCourse) => {
			if (!updatedCourse) {
				error = 'Cours non trouvé';
				course = null;
				return;
			}
			if (!initialCourse) {
				initialCourse = updatedCourse;
			}

			course = updatedCourse;

			// Load creator's profile if not already loaded or if creator changed
			if (!creator || creator.uid !== course.userId) {
				creator = await getProfile(course.userId);
			}
			loading = false;
		});
	});

	$inspect(initialCourse, 'initialCourse');

	onDestroy(() => {
		// Clean up subscription when component is destroyed
		if (unsubscribe) {
			unsubscribe();
		}
	});
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
	{:else if initialCourse}
		<div class="space-y-4">
			<Card.Root>
				<Card.Header>
					<Card.Title>
						{initialCourse.title}
						{#if creator}
							<span class="text-muted-foreground text-sm font-normal">
								par {creator.displayName || creator.email}
							</span>
						{/if}
					</Card.Title>
					<Card.Description>{initialCourse.description}</Card.Description>
				</Card.Header>
				<Card.Content>
					<!-- Course content will go here -->
				</Card.Content>
				<Card.Footer class="flex justify-between">
					<Button href="/app/courses" variant="outline">Retour aux cours</Button>
				</Card.Footer>
			</Card.Root>

			<div class="grid gap-4 md:grid-cols-2">
				<CourseParticipants course={initialCourse} />
				<Card.Root>
					<Card.Header>
						<Card.Title>Conférence vidéo</Card.Title>
						<Card.Description>Rejoignez la conférence vidéo pour ce cours</Card.Description>
					</Card.Header>
					<Card.Content>
						{#if allowedUserIds.includes(authState.user!.uid) && course}
							<VideoConference {course} />
						{:else}
							<p class="text-muted-foreground">
								Vous n'êtes pas autorisé à rejoindre cette conférence vidéo.
							</p>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	{/if}
</div>
