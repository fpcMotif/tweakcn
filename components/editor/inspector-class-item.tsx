"use client";

import { SquarePen } from "lucide-react";
import React, { memo, useCallback, useMemo } from "react";
import { segmentClassName } from "@/lib/inspector/segment-classname";
import { cn } from "@/lib/utils";
import {
  FocusColorId,
  useColorControlFocus,
} from "@/store/color-control-focus-store";
import { useEditorStore } from "@/store/editor-store";

interface InspectorClassItemProps {
  className: string;
}

const InspectorClassItem = memo(({ className }: InspectorClassItemProps) => {
  const { focusColor } = useColorControlFocus();
  const { themeState } = useEditorStore();
  const styles = themeState.styles[themeState.currentMode];
  const segments = useMemo(() => segmentClassName(className), [className]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const color = segments.value;
      if (color) {
        focusColor(color as FocusColorId);
      }
    },
    [segments.value, focusColor]
  );

  const renderSegmentedClassName = useCallback((): React.ReactNode => {
    const parts = [];

    if (segments.selector) {
      parts.push(
        <span className="text-foreground/60" key="selector">
          {segments.selector}:
        </span>
      );
    }

    if (segments.prefix) {
      parts.push(
        <span className="text-foreground" key="prefix">
          {segments.prefix}
        </span>
      );
    }

    if (segments.value) {
      parts.push(
        <span className="text-foreground/80" key="dash">
          -
        </span>,
        <span className="text-foreground font-bold" key="value">
          {segments.value}
        </span>
      );
    }

    if (segments.opacity) {
      parts.push(
        <span className="text-foreground/60" key="slash">
          /
        </span>,
        <span className="text-foreground/60" key="opacity">
          {segments.opacity}
        </span>
      );
    }

    return <>{parts}</>;
  }, [segments]);

  return (
    <div
      className="group hover:bg-foreground/10 flex cursor-pointer items-center justify-between gap-2 rounded-md p-1.5 transition-colors"
      onClick={handleClick}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "border-foreground ring-border block size-4 shrink-0 rounded-md border-1 ring-1"
          )}
          style={{
            backgroundColor: styles[segments.value as keyof typeof styles],
          }}
        />
        <span className="font-mono text-xs">{renderSegmentedClassName()}</span>
      </div>
      <SquarePen className="text-muted-foreground size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
});

InspectorClassItem.displayName = "InspectorClassItem";

export default InspectorClassItem;
