import { SquarePen } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import {
  FocusColorId,
  useColorControlFocus,
} from "@/store/color-control-focus-store";
import { ThemeEditorPreviewProps } from "@/types/theme";

interface ColorPreviewProps {
  styles: ThemeEditorPreviewProps["styles"];
  currentMode: ThemeEditorPreviewProps["currentMode"];
}

function ColorPreviewItem({
  label,
  color,
  name,
}: {
  label: string;
  color: string;
  name: string;
}) {
  const { focusColor } = useColorControlFocus();

  return (
    <div className="group/color-preview hover:bg-muted/60 relative flex items-center gap-2 rounded-md p-1 transition-colors">
      <div
        className="size-14 shrink-0 rounded-md border @max-3xl:size-12"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 space-y-1 overflow-hidden">
        <p className="line-clamp-2 text-sm leading-tight font-medium @max-3xl:text-xs">
          {label}
        </p>
        <p className="text-muted-foreground truncate font-mono text-xs">
          {color}
        </p>
      </div>

      <div className="hidden flex-col opacity-0 transition-opacity group-hover/color-preview:opacity-100 md:flex">
        <TooltipWrapper asChild label="Edit color">
          <Button
            className="size-7 @max-3xl:size-6 [&>svg]:size-3.5"
            onClick={() => focusColor(name as FocusColorId)}
            size="icon"
            variant="ghost"
          >
            <SquarePen />
          </Button>
        </TooltipWrapper>
        <CopyButton className="size-7 @max-3xl:size-6" textToCopy={color} />
      </div>
    </div>
  );
}

const ColorPreview = ({ styles, currentMode }: ColorPreviewProps) => {
  if (!styles || !styles[currentMode]) {
    return null;
  }

  return (
    <div className="@container grid grid-cols-1 gap-4 md:gap-8">
      {/* Primary Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Primary Theme Colors
        </h3>
        <div className="@6xl grid grid-cols-1 gap-2 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem
            color={styles[currentMode].background}
            label="Background"
            name="background"
          />
          <ColorPreviewItem
            color={styles[currentMode].foreground}
            label="Foreground"
            name="foreground"
          />
          <ColorPreviewItem
            color={styles[currentMode].primary}
            label="Primary"
            name="primary"
          />
          <ColorPreviewItem
            color={styles[currentMode]["primary-foreground"]}
            label="Primary Foreground"
            name="primary-foreground"
          />
        </div>
      </div>

      {/* Secondary & Accent Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Secondary & Accent Colors
        </h3>
        <div className="@6xl grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem
            color={styles[currentMode].secondary}
            label="Secondary"
            name="secondary"
          />
          <ColorPreviewItem
            color={styles[currentMode]["secondary-foreground"]}
            label="Secondary Foreground"
            name="secondary-foreground"
          />
          <ColorPreviewItem
            color={styles[currentMode].accent}
            label="Accent"
            name="accent"
          />
          <ColorPreviewItem
            color={styles[currentMode]["accent-foreground"]}
            label="Accent Foreground"
            name="accent-foreground"
          />
        </div>
      </div>

      {/* UI Component Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          UI Component Colors
        </h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem
            color={styles[currentMode].card}
            label="Card"
            name="card"
          />
          <ColorPreviewItem
            color={styles[currentMode]["card-foreground"]}
            label="Card Foreground"
            name="card-foreground"
          />
          <ColorPreviewItem
            color={styles[currentMode].popover}
            label="Popover"
            name="popover"
          />
          <ColorPreviewItem
            color={styles[currentMode]["popover-foreground"]}
            label="Popover Foreground"
            name="popover-foreground"
          />
          <ColorPreviewItem
            color={styles[currentMode].muted}
            label="Muted"
            name="muted"
          />
          <ColorPreviewItem
            color={styles[currentMode]["muted-foreground"]}
            label="Muted Foreground"
            name="muted-foreground"
          />
        </div>
      </div>

      {/* Utility & Form Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Utility & Form Colors
        </h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem
            color={styles[currentMode].border}
            label="Border"
            name="border"
          />
          <ColorPreviewItem
            color={styles[currentMode].input}
            label="Input"
            name="input"
          />
          <ColorPreviewItem
            color={styles[currentMode].ring}
            label="Ring"
            name="ring"
          />
        </div>
      </div>

      {/* Status & Feedback Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Status & Feedback Colors
        </h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem
            color={styles[currentMode].destructive}
            label="Destructive"
            name="destructive"
          />
          <ColorPreviewItem
            color={styles[currentMode]["destructive-foreground"]}
            label="Destructive Foreground"
            name="destructive-foreground"
          />
        </div>
      </div>

      {/* Chart & Data Visualization Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Chart & Visualization Colors
        </h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem
            color={styles[currentMode]["chart-1"]}
            label="Chart 1"
            name="chart-1"
          />
          <ColorPreviewItem
            color={styles[currentMode]["chart-2"]}
            label="Chart 2"
            name="chart-2"
          />
          <ColorPreviewItem
            color={styles[currentMode]["chart-3"]}
            label="Chart 3"
            name="chart-3"
          />
          <ColorPreviewItem
            color={styles[currentMode]["chart-4"]}
            label="Chart 4"
            name="chart-4"
          />
          <ColorPreviewItem
            color={styles[currentMode]["chart-5"]}
            label="Chart 5"
            name="chart-5"
          />
        </div>
      </div>

      {/* Sidebar Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Sidebar & Navigation Colors
        </h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem
            color={styles[currentMode].sidebar}
            label="Sidebar Background"
            name="sidebar"
          />
          <ColorPreviewItem
            color={styles[currentMode]["sidebar-foreground"]}
            label="Sidebar Foreground"
            name="sidebar-foreground"
          />
          <ColorPreviewItem
            color={styles[currentMode]["sidebar-primary"]}
            label="Sidebar Primary"
            name="sidebar-primary"
          />
          <ColorPreviewItem
            color={styles[currentMode]["sidebar-primary-foreground"]}
            label="Sidebar Primary Foreground"
            name="sidebar-primary-foreground"
          />
          <ColorPreviewItem
            color={styles[currentMode]["sidebar-accent"]}
            label="Sidebar Accent"
            name="sidebar-accent"
          />
          <ColorPreviewItem
            color={styles[currentMode]["sidebar-accent-foreground"]}
            label="Sidebar Accent Foreground"
            name="sidebar-accent-foreground"
          />
          <ColorPreviewItem
            color={styles[currentMode]["sidebar-border"]}
            label="Sidebar Border"
            name="sidebar-border"
          />
          <ColorPreviewItem
            color={styles[currentMode]["sidebar-ring"]}
            label="Sidebar Ring"
            name="sidebar-ring"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPreview;
