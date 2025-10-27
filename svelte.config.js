import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md", ".svx"],
  preprocess: [vitePreprocess(), mdsvex({ extensions: [".md", ".svx"] })],
  kit: {
    adapter: adapter(),
    alias: {
      $lib: "./src/lib",
      "$lib/*": "./src/lib/*",
      $components: "./components",
      "$components/*": "./components/*",
      $hooks: "./hooks",
      "$hooks/*": "./hooks/*",
      $types: "./types",
      "$types/*": "./types/*",
      $utils: "./utils",
      "$utils/*": "./utils/*",
      $store: "./store",
      "$store/*": "./store/*",
      $config: "./config",
      "$config/*": "./config/*",
      $actions: "./actions",
      "$actions/*": "./actions/*",
      $assets: "./assets",
      "$assets/*": "./assets/*",
      $convex: "./convex",
      "$convex/*": "./convex/*",
    },
  },
};

export default config;
