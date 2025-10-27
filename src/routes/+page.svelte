<script lang="ts">
import { onMount } from "svelte";
import { browser } from "$app/environment";

let isScrolled = $state(false);
let mobileMenuOpen = $state(false);

onMount(() => {
  const handleScroll = () => {
    isScrolled = window.scrollY > 10;
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
});
</script>

<svelte:head>
	<title>Beautiful themes for shadcn/ui — tweakcn | Theme Editor & Generator</title>
	<meta
		name="description"
		content="Customize theme for shadcn/ui with tweakcn's interactive editor. Supports Tailwind CSS v4, Shadcn UI, and custom styles. Modify properties, preview changes, and get the code in real time."
	/>
	<meta
		name="keywords"
		content="theme editor, theme generator, shadcn, ui, components, react, tailwind, button, editor, visual editor, component editor, web development, frontend, design system, UI components, React components, Tailwind CSS, shadcn/ui themes"
	/>
	<meta property="og:title" content="Beautiful themes for shadcn/ui — tweakcn | Theme Editor & Generator" />
	<meta
		property="og:description"
		content="Customize theme for shadcn/ui with tweakcn's interactive editor. Supports Tailwind CSS v4, Shadcn UI, and custom styles. Modify properties, preview changes, and get the code in real time."
	/>
	<meta property="og:url" content="https://tweakcn.com/" />
	<meta property="og:site_name" content="tweakcn" />
	<meta property="og:image" content="https://tweakcn.com/og-image.v050725.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Beautiful themes for shadcn/ui — tweakcn | Theme Editor & Generator" />
	<meta
		name="twitter:description"
		content="Customize theme for shadcn/ui with tweakcn's interactive editor. Supports Tailwind CSS v4, Shadcn UI, and custom styles. Modify properties, preview changes, and get the code in real time."
	/>
	<meta name="twitter:image" content="https://tweakcn.com/og-image.v050725.png" />
	<meta name="robots" content="index, follow" />
</svelte:head>

<div
	class="flex min-h-[100dvh] flex-col items-center justify-items-center bg-background text-foreground"
>
	<!-- TODO: Port Header component -->
	<header class="w-full">
		<div class="container mx-auto px-4 py-4">
			<h1 class="text-2xl font-bold">tweakcn</h1>
		</div>
	</header>

	<main class="w-full flex-1">
		<!-- TODO: Port home page components -->
		<section class="container mx-auto px-4 py-20">
			<div class="text-center">
				<h2 class="text-4xl font-bold mb-4">Beautiful themes for shadcn/ui</h2>
				<p class="text-xl text-muted-foreground mb-8">
					Customize your shadcn/ui theme with our interactive editor
				</p>
				<a href="/editor" class="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
					Get Started
				</a>
			</div>
		</section>
	</main>

	<!-- TODO: Port Footer component -->
	<footer class="w-full border-t">
		<div class="container mx-auto px-4 py-8">
			<p class="text-center text-muted-foreground">© 2025 tweakcn. All rights reserved.</p>
		</div>
	</footer>
</div>
