<script lang="ts">
import { goto } from "$app/navigation";

async function handleGetStarted() {
  await goto("/editor");
}
</script>

<svelte:head>
	<title>Pricing - tweakcn</title>
	<meta name="description" content="Simple, transparent pricing for tweakcn theme editor" />
</svelte:head>

<div class="min-h-screen bg-background">
	<div class="container mx-auto px-4 py-20">
		<div class="text-center mb-16">
			<h1 class="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
			<p class="text-xl text-muted-foreground">
				Choose the plan that works best for you
			</p>
		</div>

		<div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
			<!-- Free Plan -->
			<div class="border rounded-lg p-8 bg-card">
				<h3 class="text-2xl font-bold mb-4">Free</h3>
				<div class="mb-6">
					<span class="text-4xl font-bold">$0</span>
					<span class="text-muted-foreground">/month</span>
				</div>
				<ul class="space-y-3 mb-8">
					<li class="flex items-center">
						<svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
						Basic theme customization
					</li>
					<li class="flex items-center">
						<svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
						Limited AI requests
					</li>
					<li class="flex items-center">
						<svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
						Community support
					</li>
				</ul>
				<button
					onclick={handleGetStarted}
					class="w-full px-6 py-3 border rounded-md hover:bg-accent transition-colors"
				>
					Get Started
				</button>
			</div>

			<!-- Pro Plan -->
			<div class="border-2 border-primary rounded-lg p-8 bg-card relative">
				<div
					class="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium"
				>
					Popular
				</div>
				<h3 class="text-2xl font-bold mb-4">Pro</h3>
				<div class="mb-6">
					<span class="text-4xl font-bold">$9</span>
					<span class="text-muted-foreground">/month</span>
				</div>
				<ul class="space-y-3 mb-8">
					<li class="flex items-center">
						<svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
						Everything in Free
					</li>
					<li class="flex items-center">
						<svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
						Unlimited AI requests
					</li>
					<li class="flex items-center">
						<svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
						Advanced customization
					</li>
					<li class="flex items-center">
						<svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
						Priority support
					</li>
				</ul>
				<button
					onclick={handleGetStarted}
					class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
				>
					Upgrade to Pro
				</button>
			</div>
		</div>
	</div>
</div>

