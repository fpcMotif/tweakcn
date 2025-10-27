<script lang="ts">
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Dashboard - tweakcn</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-8">Dashboard</h1>

	{#if data.session}
		<div class="grid gap-6">
			<div class="border rounded-lg p-6 bg-card">
				<h2 class="text-xl font-semibold mb-4">Welcome back, {data.session.user.name || 'User'}!</h2>
				<p class="text-muted-foreground">
					Manage your themes and settings from your dashboard.
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-6">
				<div class="border rounded-lg p-6 bg-card">
					<h3 class="font-semibold mb-2">Themes Created</h3>
					<p class="text-3xl font-bold">0</p>
				</div>

				<div class="border rounded-lg p-6 bg-card">
					<h3 class="font-semibold mb-2">AI Requests</h3>
					<p class="text-3xl font-bold">0</p>
				</div>

				<div class="border rounded-lg p-6 bg-card">
					<h3 class="font-semibold mb-2">Subscription</h3>
					<p class="text-lg font-medium">Free Plan</p>
				</div>
			</div>

			<div class="border rounded-lg p-6 bg-card">
				<h2 class="text-xl font-semibold mb-4">Recent Themes</h2>
				<p class="text-muted-foreground">No themes yet. Start creating!</p>
			</div>
		</div>
	{:else}
		<div class="text-center py-12">
			<p class="text-muted-foreground mb-4">Please sign in to view your dashboard.</p>
			<a href="/api/auth/signin" class="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md">
				Sign In
			</a>
		</div>
	{/if}
</div>

