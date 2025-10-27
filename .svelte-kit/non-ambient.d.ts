
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/ai" | "/api" | "/api/enhance-prompt" | "/api/generate-theme" | "/api/google-fonts" | "/api/subscription" | "/dashboard" | "/docs" | "/editor" | "/pricing" | "/privacy-policy" | "/robots.txt" | "/sitemap.xml";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/ai": Record<string, never>;
			"/api": Record<string, never>;
			"/api/enhance-prompt": Record<string, never>;
			"/api/generate-theme": Record<string, never>;
			"/api/google-fonts": Record<string, never>;
			"/api/subscription": Record<string, never>;
			"/dashboard": Record<string, never>;
			"/docs": Record<string, never>;
			"/editor": Record<string, never>;
			"/pricing": Record<string, never>;
			"/privacy-policy": Record<string, never>;
			"/robots.txt": Record<string, never>;
			"/sitemap.xml": Record<string, never>
		};
		Pathname(): "/" | "/ai" | "/ai/" | "/api" | "/api/" | "/api/enhance-prompt" | "/api/enhance-prompt/" | "/api/generate-theme" | "/api/generate-theme/" | "/api/google-fonts" | "/api/google-fonts/" | "/api/subscription" | "/api/subscription/" | "/dashboard" | "/dashboard/" | "/docs" | "/docs/" | "/editor" | "/editor/" | "/pricing" | "/pricing/" | "/privacy-policy" | "/privacy-policy/" | "/robots.txt" | "/robots.txt/" | "/sitemap.xml" | "/sitemap.xml/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/apple-touch-icon.png" | "/avatar-1.png" | "/avatar-2.png" | "/avatar-3.png" | "/avatar-4.png" | "/avatar-5.png" | "/avatar-6.png" | "/favicon-16x16.png" | "/favicon-32x32.png" | "/favicon.ico" | "/file.svg" | "/globe.svg" | "/live-preview.js" | "/live-preview.min.js" | "/next.svg" | "/og-image.v050725.png" | "/placeholder.svg" | "/profile-avatar.png" | "/shadcraft-preview.jpg" | "/vercel.svg" | "/window.svg" | string & {};
	}
}