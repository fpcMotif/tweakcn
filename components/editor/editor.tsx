"use client";

import { Sliders } from "lucide-react";
import React, { use, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEditorStore } from "@/store/editor-store";
import { Theme, ThemeStyles } from "@/types/theme";
import { ActionBar } from "./action-bar/action-bar";
import ThemeControlPanel from "./theme-control-panel";
import ThemePreviewPanel from "./theme-preview-panel";

interface EditorProps {
  themePromise: Promise<Theme | null>;
}

const isThemeStyles = (styles: unknown): styles is ThemeStyles => {
  return (
    !!styles &&
    typeof styles === "object" &&
    styles !== null &&
    "light" in styles &&
    "dark" in styles
  );
};

const Editor: React.FC<EditorProps> = ({ themePromise }) => {
  const themeState = useEditorStore((state) => state.themeState);
  const setThemeState = useEditorStore((state) => state.setThemeState);
  const isMobile = useIsMobile();

  const initialTheme = themePromise ? use(themePromise) : null;

  const handleStyleChange = React.useCallback(
    (newStyles: ThemeStyles) => {
      const prev = useEditorStore.getState().themeState;
      setThemeState({ ...prev, styles: newStyles });
    },
    [setThemeState]
  );

  useEffect(() => {
    if (initialTheme && isThemeStyles(initialTheme.styles)) {
      const prev = useEditorStore.getState().themeState;
      setThemeState({
        ...prev,
        styles: initialTheme.styles,
        preset: initialTheme.id,
      });
    }
  }, [initialTheme, setThemeState]);

  if (initialTheme && !isThemeStyles(initialTheme.styles)) {
    return (
      <div className="text-destructive flex h-full items-center justify-center">
        Fetched theme data is invalid.
      </div>
    );
  }

  const styles = themeState.styles;

  // Mobile layout
  if (isMobile) {
    return (
      <div className="relative isolate flex flex-1 overflow-hidden">
        <div className="size-full flex-1 overflow-hidden">
          <Tabs className="h-full" defaultValue="controls">
            <TabsList className="w-full rounded-none">
              <TabsTrigger className="flex-1" value="controls">
                <Sliders className="mr-2 h-4 w-4" />
                Controls
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="preview">
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent
              className="mt-0 h-[calc(100%-2.5rem)]"
              value="controls"
            >
              <div className="flex h-full flex-col">
                <ThemeControlPanel
                  currentMode={themeState.currentMode}
                  onChange={handleStyleChange}
                  styles={styles}
                  themePromise={themePromise}
                />
              </div>
            </TabsContent>
            <TabsContent className="mt-0 h-[calc(100%-2.5rem)]" value="preview">
              <div className="flex h-full flex-col">
                <ActionBar />
                <ThemePreviewPanel
                  currentMode={themeState.currentMode}
                  styles={styles}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="relative isolate flex flex-1 overflow-hidden">
      <div className="size-full">
        <ResizablePanelGroup className="isolate" direction="horizontal">
          <ResizablePanel
            className="z-1 min-w-[max(20%,22rem)]"
            defaultSize={30}
            maxSize={40}
            minSize={20}
          >
            <div className="relative isolate flex h-full flex-1 flex-col">
              <ThemeControlPanel
                currentMode={themeState.currentMode}
                onChange={handleStyleChange}
                styles={styles}
                themePromise={themePromise}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={70}>
            <div className="flex h-full flex-col">
              <div className="flex min-h-0 flex-1 flex-col">
                <ActionBar />
                <ThemePreviewPanel
                  currentMode={themeState.currentMode}
                  styles={styles}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Editor;
