"use client";

import { AlertCircle, Sparkle } from "lucide-react";
import React, { use } from "react";

import { ChatInterface } from "@/components/editor/ai/chat-interface";
import ColorPicker from "@/components/editor/color-picker";
import ControlSection from "@/components/editor/control-section";
import { FontPicker } from "@/components/editor/font-picker";
import HslAdjustmentControls from "@/components/editor/hsl-adjustment-controls";
import ShadowControl from "@/components/editor/shadow-control";
import { SliderWithInput } from "@/components/editor/slider-with-input";
import ThemeEditActions from "@/components/editor/theme-edit-actions";
import ThemePresetSelect from "@/components/editor/theme-preset-select";
import TabsTriggerPill from "@/components/editor/theme-preview/tabs-trigger-pill";
import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { COMMON_STYLES, defaultThemeState } from "@/config/theme";
import { useAIThemeGenerationCore } from "@/hooks/use-ai-theme-generation-core";
import {
  type ControlTab,
  useControlsTabFromUrl,
} from "@/hooks/use-controls-tab-from-url";
import { useEditorStore } from "@/store/editor-store";
import { type FontInfo } from "@/types/fonts";
import { ThemeEditorControlsProps, ThemeStyleProps } from "@/types/theme";
import { buildFontFamily } from "@/utils/fonts";
import { getAppliedThemeFont } from "@/utils/theme-fonts";

const ThemeControlPanel = ({
  styles,
  currentMode,
  onChange,
  themePromise,
}: ThemeEditorControlsProps) => {
  const { themeState } = useEditorStore();
  const { tab, handleSetTab } = useControlsTabFromUrl();
  const { isGeneratingTheme } = useAIThemeGenerationCore();

  const currentStyles = React.useMemo(
    () => ({
      ...defaultThemeState.styles[currentMode],
      ...styles?.[currentMode],
    }),
    [currentMode, styles]
  );

  const updateStyle = React.useCallback(
    <K extends keyof typeof currentStyles>(
      key: K,
      value: (typeof currentStyles)[K]
    ) => {
      // apply common styles to both light and dark modes
      if (COMMON_STYLES.includes(key)) {
        onChange({
          ...styles,
          light: { ...styles.light, [key]: value },
          dark: { ...styles.dark, [key]: value },
        });
        return;
      }

      onChange({
        ...styles,
        [currentMode]: {
          ...currentStyles,
          [key]: value,
        },
      });
    },
    [onChange, styles, currentMode, currentStyles]
  );

  // Ensure we have valid styles for the current mode
  if (!currentStyles) {
    return null; // Or some fallback UI
  }

  const radius = parseFloat(currentStyles.radius.replace("rem", ""));

  const theme = use(themePromise);

  return (
    <>
      <div className="border-b">
        {!theme ? (
          <ThemePresetSelect
            className="h-14 rounded-none"
            disabled={isGeneratingTheme}
          />
        ) : (
          <ThemeEditActions disabled={isGeneratingTheme} theme={theme} />
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col space-y-4">
        <Tabs
          className="flex min-h-0 w-full flex-1 flex-col"
          onValueChange={(v) => handleSetTab(v as ControlTab)}
          value={tab}
        >
          <HorizontalScrollArea className="mt-2 mb-1 px-4">
            <TabsList className="bg-background text-muted-foreground inline-flex w-fit items-center justify-center rounded-full px-0">
              <TabsTriggerPill value="colors">Colors</TabsTriggerPill>
              <TabsTriggerPill value="typography">Typography</TabsTriggerPill>
              <TabsTriggerPill value="other">Other</TabsTriggerPill>
              <TabsTriggerPill
                className="data-[state=active]:[--effect:var(--secondary-foreground)] data-[state=active]:[--foreground:var(--muted-foreground)] data-[state=active]:[--muted-foreground:var(--effect)]"
                value="ai"
              >
                <Sparkle className="mr-1 size-3.5 text-current" />
                <span className="animate-text via-foreground from-muted-foreground to-muted-foreground flex items-center gap-1 bg-gradient-to-r from-50% via-60% to-100% bg-[200%_auto] bg-clip-text text-sm text-transparent">
                  Generate
                </span>
              </TabsTriggerPill>
            </TabsList>
          </HorizontalScrollArea>

          <TabsContent
            className="mt-1 size-full overflow-hidden"
            value="colors"
          >
            <ScrollArea className="h-full px-4">
              <ControlSection expanded title="Primary Colors">
                <ColorPicker
                  color={currentStyles.primary}
                  label="Primary"
                  name="primary"
                  onChange={(color) => updateStyle("primary", color)}
                />
                <ColorPicker
                  color={currentStyles["primary-foreground"]}
                  label="Primary Foreground"
                  name="primary-foreground"
                  onChange={(color) => updateStyle("primary-foreground", color)}
                />
              </ControlSection>

              <ControlSection expanded title="Secondary Colors">
                <ColorPicker
                  color={currentStyles.secondary}
                  label="Secondary"
                  name="secondary"
                  onChange={(color) => updateStyle("secondary", color)}
                />
                <ColorPicker
                  color={currentStyles["secondary-foreground"]}
                  label="Secondary Foreground"
                  name="secondary-foreground"
                  onChange={(color) =>
                    updateStyle("secondary-foreground", color)
                  }
                />
              </ControlSection>

              <ControlSection title="Accent Colors">
                <ColorPicker
                  color={currentStyles.accent}
                  label="Accent"
                  name="accent"
                  onChange={(color) => updateStyle("accent", color)}
                />
                <ColorPicker
                  color={currentStyles["accent-foreground"]}
                  label="Accent Foreground"
                  name="accent-foreground"
                  onChange={(color) => updateStyle("accent-foreground", color)}
                />
              </ControlSection>

              <ControlSection title="Base Colors">
                <ColorPicker
                  color={currentStyles.background}
                  label="Background"
                  name="background"
                  onChange={(color) => updateStyle("background", color)}
                />
                <ColorPicker
                  color={currentStyles.foreground}
                  label="Foreground"
                  name="foreground"
                  onChange={(color) => updateStyle("foreground", color)}
                />
              </ControlSection>

              <ControlSection title="Card Colors">
                <ColorPicker
                  color={currentStyles.card}
                  label="Card Background"
                  name="card"
                  onChange={(color) => updateStyle("card", color)}
                />
                <ColorPicker
                  color={currentStyles["card-foreground"]}
                  label="Card Foreground"
                  name="card-foreground"
                  onChange={(color) => updateStyle("card-foreground", color)}
                />
              </ControlSection>

              <ControlSection title="Popover Colors">
                <ColorPicker
                  color={currentStyles.popover}
                  label="Popover Background"
                  name="popover"
                  onChange={(color) => updateStyle("popover", color)}
                />
                <ColorPicker
                  color={currentStyles["popover-foreground"]}
                  label="Popover Foreground"
                  name="popover-foreground"
                  onChange={(color) => updateStyle("popover-foreground", color)}
                />
              </ControlSection>

              <ControlSection title="Muted Colors">
                <ColorPicker
                  color={currentStyles.muted}
                  label="Muted"
                  name="muted"
                  onChange={(color) => updateStyle("muted", color)}
                />
                <ColorPicker
                  color={currentStyles["muted-foreground"]}
                  label="Muted Foreground"
                  name="muted-foreground"
                  onChange={(color) => updateStyle("muted-foreground", color)}
                />
              </ControlSection>

              <ControlSection title="Destructive Colors">
                <ColorPicker
                  color={currentStyles.destructive}
                  label="Destructive"
                  name="destructive"
                  onChange={(color) => updateStyle("destructive", color)}
                />
                <ColorPicker
                  color={currentStyles["destructive-foreground"]}
                  label="Destructive Foreground"
                  name="destructive-foreground"
                  onChange={(color) =>
                    updateStyle("destructive-foreground", color)
                  }
                />
              </ControlSection>

              <ControlSection title="Border & Input Colors">
                <ColorPicker
                  color={currentStyles.border}
                  label="Border"
                  name="border"
                  onChange={(color) => updateStyle("border", color)}
                />
                <ColorPicker
                  color={currentStyles.input}
                  label="Input"
                  name="input"
                  onChange={(color) => updateStyle("input", color)}
                />
                <ColorPicker
                  color={currentStyles.ring}
                  label="Ring"
                  name="ring"
                  onChange={(color) => updateStyle("ring", color)}
                />
              </ControlSection>

              <ControlSection title="Chart Colors">
                <ColorPicker
                  color={currentStyles["chart-1"]}
                  label="Chart 1"
                  name="chart-1"
                  onChange={(color) => updateStyle("chart-1", color)}
                />
                <ColorPicker
                  color={currentStyles["chart-2"]}
                  label="Chart 2"
                  name="chart-2"
                  onChange={(color) => updateStyle("chart-2", color)}
                />
                <ColorPicker
                  color={currentStyles["chart-3"]}
                  label="Chart 3"
                  name="chart-3"
                  onChange={(color) => updateStyle("chart-3", color)}
                />
                <ColorPicker
                  color={currentStyles["chart-4"]}
                  label="Chart 4"
                  name="chart-4"
                  onChange={(color) => updateStyle("chart-4", color)}
                />
                <ColorPicker
                  color={currentStyles["chart-5"]}
                  label="Chart 5"
                  name="chart-5"
                  onChange={(color) => updateStyle("chart-5", color)}
                />
              </ControlSection>

              <ControlSection title="Sidebar Colors">
                <ColorPicker
                  color={currentStyles.sidebar}
                  label="Sidebar Background"
                  name="sidebar"
                  onChange={(color) => updateStyle("sidebar", color)}
                />
                <ColorPicker
                  color={currentStyles["sidebar-foreground"]}
                  label="Sidebar Foreground"
                  name="sidebar-foreground"
                  onChange={(color) => updateStyle("sidebar-foreground", color)}
                />
                <ColorPicker
                  color={currentStyles["sidebar-primary"]}
                  label="Sidebar Primary"
                  name="sidebar-primary"
                  onChange={(color) => updateStyle("sidebar-primary", color)}
                />
                <ColorPicker
                  color={currentStyles["sidebar-primary-foreground"]}
                  label="Sidebar Primary Foreground"
                  name="sidebar-primary-foreground"
                  onChange={(color) =>
                    updateStyle("sidebar-primary-foreground", color)
                  }
                />
                <ColorPicker
                  color={currentStyles["sidebar-accent"]}
                  label="Sidebar Accent"
                  name="sidebar-accent"
                  onChange={(color) => updateStyle("sidebar-accent", color)}
                />
                <ColorPicker
                  color={currentStyles["sidebar-accent-foreground"]}
                  label="Sidebar Accent Foreground"
                  name="sidebar-accent-foreground"
                  onChange={(color) =>
                    updateStyle("sidebar-accent-foreground", color)
                  }
                />
                <ColorPicker
                  color={currentStyles["sidebar-border"]}
                  label="Sidebar Border"
                  name="sidebar-border"
                  onChange={(color) => updateStyle("sidebar-border", color)}
                />
                <ColorPicker
                  color={currentStyles["sidebar-ring"]}
                  label="Sidebar Ring"
                  name="sidebar-ring"
                  onChange={(color) => updateStyle("sidebar-ring", color)}
                />
              </ControlSection>
            </ScrollArea>
          </TabsContent>

          <TabsContent
            className="mt-1 size-full overflow-hidden"
            value="typography"
          >
            <ScrollArea className="h-full px-4">
              <div className="bg-muted/50 mb-4 flex items-start gap-2.5 rounded-md border p-3">
                <AlertCircle className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                <div className="text-muted-foreground text-sm">
                  <p>
                    To use custom fonts, embed them in your project. <br />
                    See{" "}
                    <a
                      className="hover:text-muted-foreground/90 underline underline-offset-2"
                      href="https://tailwindcss.com/docs/font-family"
                      target="_blank"
                    >
                      Tailwind docs
                    </a>{" "}
                    for details.
                  </p>
                </div>
              </div>

              <ControlSection className="p-3" expanded title="Font Family">
                <div className="mb-4">
                  <Label className="mb-1.5 block text-xs" htmlFor="font-sans">
                    Sans-Serif Font
                  </Label>
                  <FontPicker
                    category="sans-serif"
                    onSelect={(font: FontInfo) => {
                      const fontFamily = buildFontFamily(
                        font.family,
                        font.category
                      );
                      updateStyle("font-sans", fontFamily);
                    }}
                    placeholder="Choose a sans-serif font..."
                    value={
                      getAppliedThemeFont(themeState, "font-sans") || undefined
                    }
                  />
                </div>

                <div className="mb-4">
                  <Label className="mb-1.5 block text-xs" htmlFor="font-serif">
                    Serif Font
                  </Label>
                  <FontPicker
                    category="serif"
                    onSelect={(font: FontInfo) => {
                      const fontFamily = buildFontFamily(
                        font.family,
                        font.category
                      );
                      updateStyle("font-serif", fontFamily);
                    }}
                    placeholder="Choose a serif font..."
                    value={
                      getAppliedThemeFont(themeState, "font-serif") || undefined
                    }
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block text-xs" htmlFor="font-mono">
                    Monospace Font
                  </Label>
                  <FontPicker
                    category="monospace"
                    onSelect={(font: FontInfo) => {
                      const fontFamily = buildFontFamily(
                        font.family,
                        font.category
                      );
                      updateStyle("font-mono", fontFamily);
                    }}
                    placeholder="Choose a monospace font..."
                    value={
                      getAppliedThemeFont(themeState, "font-mono") || undefined
                    }
                  />
                </div>
              </ControlSection>

              <ControlSection expanded title="Letter Spacing">
                <SliderWithInput
                  label="Letter Spacing"
                  max={0.5}
                  min={-0.5}
                  onChange={(value) =>
                    updateStyle("letter-spacing", `${value}em`)
                  }
                  step={0.025}
                  unit="em"
                  value={parseFloat(
                    currentStyles["letter-spacing"]?.replace("em", "")
                  )}
                />
              </ControlSection>
            </ScrollArea>
          </TabsContent>

          <TabsContent className="mt-1 size-full overflow-hidden" value="other">
            <ScrollArea className="h-full px-4">
              <ControlSection expanded title="HSL Adjustments">
                <HslAdjustmentControls />
              </ControlSection>

              <ControlSection expanded title="Radius">
                <SliderWithInput
                  label="Radius"
                  max={5}
                  min={0}
                  onChange={(value) => updateStyle("radius", `${value}rem`)}
                  step={0.025}
                  unit="rem"
                  value={radius}
                />
              </ControlSection>

              <ControlSection title="Spacing">
                <SliderWithInput
                  label="Spacing"
                  max={0.35}
                  min={0.15}
                  onChange={(value) => updateStyle("spacing", `${value}rem`)}
                  step={0.01}
                  unit="rem"
                  value={parseFloat(
                    currentStyles?.spacing?.replace("rem", "") || "0"
                  )}
                />
              </ControlSection>

              <ControlSection title="Shadow">
                <ShadowControl
                  onChange={(key, value) => {
                    if (key === "shadow-color") {
                      updateStyle(key, value as string);
                    } else if (key === "shadow-opacity") {
                      updateStyle(key, value.toString());
                    } else {
                      updateStyle(key as keyof ThemeStyleProps, `${value}px`);
                    }
                  }}
                  shadowBlur={parseFloat(
                    currentStyles["shadow-blur"]?.replace("px", "")
                  )}
                  shadowColor={currentStyles["shadow-color"]}
                  shadowOffsetX={parseFloat(
                    currentStyles["shadow-offset-x"]?.replace("px", "")
                  )}
                  shadowOffsetY={parseFloat(
                    currentStyles["shadow-offset-y"]?.replace("px", "")
                  )}
                  shadowOpacity={parseFloat(currentStyles["shadow-opacity"])}
                  shadowSpread={parseFloat(
                    currentStyles["shadow-spread"]?.replace("px", "")
                  )}
                />
              </ControlSection>
            </ScrollArea>
          </TabsContent>

          <TabsContent className="mt-1 size-full overflow-hidden" value="ai">
            <ChatInterface />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ThemeControlPanel;
