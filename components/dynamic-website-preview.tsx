"use client";

import {
  AlertCircle,
  CheckCircle,
  CloudAlert,
  ExternalLink,
  Globe,
  Info,
  Loader,
  RefreshCw,
  X,
  XCircle,
} from "lucide-react";
import { usePostHog } from "posthog-js/react";
import React, { useEffect, useRef } from "react";
import Logo from "@/assets/logo.svg";
import {
  CodeBlock,
  CodeBlockCopyButton,
} from "@/components/ai-elements/code-block";
import {
  BlockViewer,
  BlockViewerDisplay,
  BlockViewerToolbar,
} from "@/components/block-viewer";
import { LoadingLogo } from "@/components/editor/ai/loading-logo";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIframeThemeInjector } from "@/hooks/use-iframe-theme-injector";
import { useWebsitePreview } from "@/hooks/use-website-preview";
import { cn } from "@/lib/utils";
import { IframeStatus } from "@/types/live-preview-embed";

/**
 * Dynamic Website Preview - Load and theme external websites
 *
 * Usage Examples:
 *
 * // Same-origin mode (default) - direct DOM theme injection
 * <DynamicWebsitePreview name="Local Preview" />
 *
 * // Cross-origin mode - requires external sites to include embed script
 * <DynamicWebsitePreview name="External Preview" allowCrossOrigin />
 *
 * The allowCrossOrigin flag must be explicitly set to true to enable
 * external website theming via the embed script.
 */

const SCRIPT_URL = "https://tweakcn.com/live-preview.min.js";

// Code snippets for quick installation across common setups
const HTML_SNIPPET = `<!-- Add inside <head> -->\n<script src="${SCRIPT_URL}"></script>`;

const NEXT_APP_SNIPPET = `// app/layout.tsx\nexport default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="${SCRIPT_URL}"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}`;

const NEXT_PAGES_SNIPPET = `// pages/_document.tsx\n
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          async
          crossOrigin="anonymous"
          src="${SCRIPT_URL}"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}`;

const VITE_SNIPPET = `<!-- index.html -->\n<!doctype html>
<html lang="en">
  <head>
    <script
      crossOrigin="anonymous"
      src="${SCRIPT_URL}"
    />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>`;

const REMIX_SNIPPET = `// app/root.tsx\nimport { Links, Meta, Outlet, Scripts } from "@remix-run/react";

export default function App() {
  return (
    <html>
      <head>
        <link
          rel="icon"
          href="data:image/x-icon;base64,AA"
        />
        <Meta />
        <script
          crossOrigin="anonymous"
          src="${SCRIPT_URL}"
        />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}`;

type DynamicWebsitePreviewContextType = ReturnType<typeof useWebsitePreview> &
  Omit<ReturnType<typeof useIframeThemeInjector>, "ref">;

const DynamicWebsitePreviewContext =
  React.createContext<DynamicWebsitePreviewContextType | null>(null);

function useDynamicWebsitePreview() {
  const context = React.useContext(DynamicWebsitePreviewContext);
  if (!context) {
    throw new Error(
      "useDynamicWebsitePreview must be used within a DynamicWebsitePreviewProvider."
    );
  }
  return context;
}

function DynamicWebsitePreviewProvider({
  children,
  allowCrossOrigin = false,
}: {
  children: React.ReactNode;
  allowCrossOrigin?: boolean;
}) {
  const websitePreviewState = useWebsitePreview({ allowCrossOrigin });
  const posthog = usePostHog();

  const { status, retryValidation, themeInjectionError } =
    useIframeThemeInjector({
      allowCrossOrigin: allowCrossOrigin && !!websitePreviewState.currentUrl,
      iframeRef: websitePreviewState.iframeRef,
    });

  const statusRef = useRef<IframeStatus>(status);
  // eslint-disable-next-line
  statusRef.current = status;

  useEffect(() => {
    if (websitePreviewState.currentUrl) {
      setTimeout(() => {
        // capturing after 1s delay so status is finalized
        posthog.capture("DYNAMIC_PREVIEW_LOADED", {
          previewUrl: websitePreviewState.currentUrl,
          status: statusRef.current,
        });
      }, 1000);
    }
  }, [websitePreviewState.currentUrl, posthog]);

  const contextValue = {
    ...websitePreviewState,
    status,
    retryValidation,
    themeInjectionError,
  };

  return (
    <DynamicWebsitePreviewContext.Provider value={contextValue}>
      {children}
    </DynamicWebsitePreviewContext.Provider>
  );
}

export function DynamicWebsitePreview({
  className,
  name,
  allowCrossOrigin = false,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  name: string;
  allowCrossOrigin?: boolean;
}) {
  return (
    <DynamicWebsitePreviewProvider allowCrossOrigin={allowCrossOrigin}>
      <BlockViewer
        className={cn(
          "group/block-view-wrapper bg-background @container isolate flex size-full min-w-0 flex-col overflow-clip",
          className
        )}
        {...props}
      >
        <BlockViewerToolbar
          className="bg-muted h-fit"
          name={name}
          toolbarControls={<Controls />}
        />
        <DynamicWebsitePreviewContent name={name} />
      </BlockViewer>
    </DynamicWebsitePreviewProvider>
  );
}

function DynamicWebsitePreviewContent({ name }: { name: string }) {
  const { currentUrl, error: previewError } = useDynamicWebsitePreview();

  if (!currentUrl && !previewError) {
    return <NoWebsitePreviewLoaded />;
  }

  if (previewError) {
    return <WebsitePreviewError error={previewError} />;
  }

  return <WebsitePreview name={name} />;
}

function Controls() {
  const {
    inputUrl,
    setInputUrl,
    currentUrl,
    isLoading: previewIsLoading,
    loadUrl,
    refreshIframe,
    openInNewTab,
    reset,
    allowCrossOrigin,
  } = useDynamicWebsitePreview();

  const handleReset = () => {
    if (currentUrl) {
      reset();
      setInputUrl("");
    } else {
      setInputUrl("");
    }
  };

  return (
    <div className="flex size-full items-center gap-1.5">
      <div className="relative max-w-xl flex-1">
        <Input
          className={cn(
            "peer bg-background text-foreground h-8 pl-8 text-sm shadow-none transition-all duration-200",
            "focus:bg-input/50 hover:bg-input/20",
            currentUrl && "pr-8"
          )}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={(e) => {
            if (!inputUrl.trim()) return;
            if (e.key === "Enter") {
              loadUrl();
            }
          }}
          placeholder={
            !allowCrossOrigin
              ? "Enter same-origin URL for direct theme injection"
              : "Enter website URL (e.g. http://localhost:3000/login)"
          }
          type="url"
          value={inputUrl}
        />

        <Globe
          className={cn(
            "text-muted-foreground absolute top-0 left-2 size-4 translate-y-1/2 transition-colors",
            "peer-focus:text-foreground/70"
          )}
        />

        {(currentUrl || inputUrl) && (
          <TooltipWrapper asChild label="Reset">
            <Button
              className="absolute top-0 right-0 size-8 translate-y-0 hover:bg-transparent"
              onClick={handleReset}
              size="icon"
              variant="ghost"
            >
              <X className="text-muted-foreground hover:text-foreground size-3.5 transition-colors" />
            </Button>
          </TooltipWrapper>
        )}
      </div>

      <TooltipWrapper asChild label="Refresh website">
        <Button
          className="size-8 shadow-none transition-all hover:scale-105"
          disabled={previewIsLoading || !currentUrl}
          onClick={refreshIframe}
          size="icon"
          variant="outline"
        >
          <RefreshCw
            className={cn(
              "size-3.5 transition-transform",
              previewIsLoading && "animate-spin"
            )}
          />
        </Button>
      </TooltipWrapper>

      <TooltipWrapper asChild label="Open in new tab">
        <Button
          className="size-8 px-2 shadow-none transition-all hover:scale-105"
          disabled={!currentUrl || previewIsLoading}
          onClick={openInNewTab}
          size="icon"
          variant="outline"
        >
          <ExternalLink className="size-3.5" />
        </Button>
      </TooltipWrapper>
    </div>
  );
}

function NoWebsitePreviewLoaded() {
  return (
    <div className="scrollbar-thin scrollbar-gutter-both relative flex size-full flex-col overflow-y-auto p-4 py-8">
      <div className="text-muted-foreground mx-auto my-auto flex w-full max-w-xl min-w-0 flex-col items-center justify-center space-y-6">
        <div className="flex items-center gap-1">
          <div className="bg-muted outline-border/50 flex size-16 flex-col items-center justify-center rounded-full outline">
            <Globe className="text-foreground size-7" />
          </div>
          <X className="text-muted-foreground size-6" />
          <div className="bg-muted outline-border/50 flex size-16 flex-col items-center justify-center rounded-full outline">
            <Logo className="text-foreground size-7" />
          </div>
        </div>

        <h3 className="text-foreground text-center text-lg font-medium md:text-2xl">
          Preview your Website in tweakcn
        </h3>

        <div className="text-muted-foreground space-y-2 text-left text-sm">
          <div className="flex gap-2">
            <span className="text-foreground font-semibold">1.</span>
            <span>
              Add the script below to your website based on your framework
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-foreground font-semibold">2.</span>
            <span>
              Paste your website&apos;s URL (e.g.,{" "}
              <code className="code-inline">http://localhost:3000</code>) above
              to preview it with the theme applied in real-time
            </span>
          </div>
        </div>

        <Card className="w-full p-2">
          <Tabs
            className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden"
            defaultValue="script"
          >
            <div className="scrollbar-thin flex items-center justify-between overflow-x-auto rounded-lg border p-1">
              <TabsList className="m-0 h-fit bg-transparent p-0">
                <TabsTrigger
                  className="h-7 px-3 text-xs font-medium"
                  value="script"
                >
                  Script Tag
                </TabsTrigger>
                <TabsTrigger
                  className="h-7 px-3 text-xs font-medium"
                  value="next-app"
                >
                  Next.js (App)
                </TabsTrigger>
                <TabsTrigger
                  className="h-7 px-3 text-xs font-medium"
                  value="next-pages"
                >
                  Next.js (Pages)
                </TabsTrigger>
                <TabsTrigger
                  className="h-7 px-3 text-xs font-medium"
                  value="vite"
                >
                  Vite
                </TabsTrigger>
                <TabsTrigger
                  className="h-7 px-3 text-xs font-medium"
                  value="remix"
                >
                  Remix
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="bg-background scrollbar-thin max-h-76 overflow-y-auto rounded-lg border">
              <TabsContent className="m-0" value="script">
                <CodeBlock
                  className="rounded-none border-none bg-transparent"
                  code={HTML_SNIPPET}
                  language="html"
                >
                  <CodeBlockCopyButton aria-label="Copy HTML snippet" />
                </CodeBlock>
              </TabsContent>

              <TabsContent className="m-0" value="next-app">
                <CodeBlock
                  className="rounded-none border-none bg-transparent"
                  code={NEXT_APP_SNIPPET}
                  language="tsx"
                >
                  <CodeBlockCopyButton aria-label="Copy Next.js App snippet" />
                </CodeBlock>
              </TabsContent>

              <TabsContent className="m-0" value="next-pages">
                <CodeBlock
                  className="rounded-none border-none bg-transparent"
                  code={NEXT_PAGES_SNIPPET}
                  language="tsx"
                >
                  <CodeBlockCopyButton aria-label="Copy Next.js Pages snippet" />
                </CodeBlock>
              </TabsContent>

              <TabsContent className="m-0" value="vite">
                <CodeBlock
                  className="rounded-none border-none bg-transparent"
                  code={VITE_SNIPPET}
                  language="html"
                >
                  <CodeBlockCopyButton aria-label="Copy Vite snippet" />
                </CodeBlock>
              </TabsContent>

              <TabsContent className="m-0" value="remix">
                <CodeBlock
                  className="rounded-none border-none bg-transparent"
                  code={REMIX_SNIPPET}
                  language="tsx"
                >
                  <CodeBlockCopyButton aria-label="Copy Remix snippet" />
                </CodeBlock>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

function WebsitePreviewLoading() {
  return (
    <div className="bg-muted flex size-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative isolate size-10">
          <LoadingLogo />
        </div>

        <span className="text-muted-foreground animate-pulse text-sm">
          Loading website
        </span>
      </div>
    </div>
  );
}

function WebsitePreviewError({ error }: { error: string }) {
  return (
    <div className="bg-muted relative size-full overflow-hidden p-4">
      <div className="flex h-full flex-col items-center justify-center space-y-6 p-4 text-center">
        <div className="bg-destructive/80 outline-border/50 flex size-16 flex-col items-center justify-center rounded-full outline">
          <CloudAlert className="text-destructive-foreground size-7" />
        </div>

        <div className="space-y-2">
          <h3 className="text-foreground text-center text-lg font-medium md:text-2xl">
            Error Loading Website Preview
          </h3>
          <span className="text-muted-foreground max-w-md text-sm text-balance">
            {error}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Content component that manages the iframe and its loading states
 * Theme injection is now handled entirely by the useIframeThemeInjector hook
 */
function WebsitePreview({ name }: { name: string }) {
  const {
    currentUrl,
    isLoading: previewIsLoading,
    status,
    retryValidation,
    allowCrossOrigin,
    iframeRef,
    handleIframeLoad,
    handleIframeError,
    themeInjectionError,
  } = useDynamicWebsitePreview();

  return (
    <BlockViewerDisplay className="relative" name={name}>
      {previewIsLoading && (
        <div className="absolute inset-0">
          <WebsitePreviewLoading />
        </div>
      )}

      <iframe
        className="size-full"
        loading="lazy"
        onError={handleIframeError}
        onLoad={handleIframeLoad}
        ref={iframeRef}
        sandbox={
          allowCrossOrigin
            ? "allow-scripts allow-same-origin allow-forms allow-popups"
            : "allow-scripts allow-same-origin"
        }
        src={currentUrl}
        title="Dynamic Website Preview"
      />

      {!previewIsLoading && !!status && allowCrossOrigin && (
        <div className="absolute bottom-2 left-2 z-10">
          <ConnectionStatus
            errorMsg={themeInjectionError}
            isLoading={previewIsLoading}
            retryValidation={retryValidation}
            status={status}
          />
        </div>
      )}
    </BlockViewerDisplay>
  );
}

const ConnectionStatus = React.memo(
  ({
    status,
    retryValidation,
    isLoading,
    errorMsg,
  }: {
    status: IframeStatus;
    retryValidation: () => void;
    isLoading: boolean;
    errorMsg?: string | null;
  }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [displayedStatus, setDisplayedStatus] =
      React.useState<IframeStatus>(status);
    const showTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const hideTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const hasShownSupportedRef = React.useRef(false);

    React.useEffect(() => {
      // Clear any existing timeouts
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      // If we've already shown "supported" and hidden it, don't show it again
      // unless there was an error state in between
      if (status === "supported" && hasShownSupportedRef.current) {
        return;
      }

      // Reset the flag if we hit an error state
      if (
        status === "missing" ||
        status === "unsupported" ||
        status === "error"
      ) {
        hasShownSupportedRef.current = false;
      }

      // Debounce: Wait 1s before showing the status to avoid flashing
      showTimeoutRef.current = setTimeout(() => {
        setDisplayedStatus(status);
        setIsVisible(true);

        // Auto-hide after delay only for "supported" status
        if (status === "supported") {
          hasShownSupportedRef.current = true;
          hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
          }, 2000);
        }
      }, 500);

      return () => {
        if (showTimeoutRef.current) {
          clearTimeout(showTimeoutRef.current);
        }
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      };
    }, [status]);

    if (isLoading || status === "unknown" || !isVisible) return null;

    return (
      <div className="bg-popover/90 outline-border/50 animate-in fade-in slide-in-from-bottom-2 flex h-8 items-center gap-2 rounded-lg px-2 shadow-sm outline backdrop-blur-lg duration-200">
        <div className="flex items-center gap-1">
          <span className="text-foreground/90">
            {errorMsg ? (
              <HoverCard>
                <HoverCardTrigger>{ICONS[displayedStatus]}</HoverCardTrigger>
                <HoverCardContent
                  align="start"
                  className="size-fit max-w-[280px] min-w-[140px] p-2"
                  side="top"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Info className="size-3" />
                      <p className="text-xs font-medium">Error details:</p>
                    </div>

                    <p className="text-muted-foreground text-xs text-pretty">
                      {errorMsg}
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ) : (
              ICONS[displayedStatus]
            )}
          </span>
          <span className="text-foreground/90 flex items-center gap-1 text-sm font-medium">
            {TEXTS[displayedStatus]}
          </span>
        </div>

        {(displayedStatus === "missing" ||
          displayedStatus === "unsupported" ||
          displayedStatus === "error") && (
          <div className="flex items-center gap-1">
            <Button
              className="h-6 px-2 text-xs shadow-none"
              onClick={retryValidation}
              size="sm"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        )}
      </div>
    );
  }
);

ConnectionStatus.displayName = "ConnectionStatus";

const ICONS: Record<IframeStatus, React.ReactNode> = {
  unknown: null,
  checking: <Loader className="size-4 animate-spin" />,
  connected: <CheckCircle className="size-4" />,
  supported: <CheckCircle className="size-4" />,
  unsupported: <AlertCircle className="size-4" />,
  missing: <XCircle className="text-destructive size-4" />,
  error: <XCircle className="text-destructive size-4" />,
};

const TEXTS: Record<IframeStatus, string> = {
  unknown: "",
  checking: "Checking connection",
  connected: "Connected",
  supported: "Live preview enabled",
  unsupported: "Unsupported site",
  missing: "Script not found",
  error: "An error occurred",
};
