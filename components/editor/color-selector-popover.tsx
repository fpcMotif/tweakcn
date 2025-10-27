"use client";

import { Check, LayoutGrid, List } from "lucide-react";
import { useCallback } from "react";
import TailwindCSS from "@/components/icons/tailwind-css";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ColorSelectorTab,
  usePreferencesStore,
} from "@/store/preferences-store";
import { TAILWIND_PALETTE } from "@/utils/registry/tailwind-colors";
import { Separator } from "../ui/separator";

type ColorSelectorPopoverProps = {
  currentColor: string;
  onChange: (color: string) => void;
};

export function ColorSelectorPopover({
  currentColor,
  onChange,
}: ColorSelectorPopoverProps) {
  const handleColorSelect = useCallback(
    (color: string) => {
      onChange(color);
    },
    [onChange]
  );

  const { setColorSelectorTab, colorSelectorTab } = usePreferencesStore();

  const handleTabChange = useCallback(
    (value: string) => {
      setColorSelectorTab(value as ColorSelectorTab);
    },
    [setColorSelectorTab]
  );

  const isColorSelected = useCallback(
    (color: string) => {
      return currentColor === color;
    },
    [currentColor]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <TooltipWrapper asChild label="Tailwind Colors">
          <Button
            className="group bg-input/25 size-8 rounded border shadow-none"
            size="sm"
            variant="ghost"
          >
            <TailwindCSS className="text-foreground group-hover:text-accent-foreground size-4 transition-colors" />
          </Button>
        </TooltipWrapper>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="size-auto gap-0 overflow-hidden p-0"
      >
        <Tabs defaultValue={colorSelectorTab} onValueChange={handleTabChange}>
          <div className="flex items-center justify-between gap-4">
            <div className="ml-2 flex items-center gap-1.5">
              <TailwindCSS className="size-4" />
              <span className="text-muted-foreground text-sm tabular-nums">
                Tailwind v4
              </span>
            </div>

            <TabsList className="bg-transparent">
              <TabsTrigger
                className="data-[state=active]:bg-input/25 size-8 p-0 data-[state=active]:shadow-none"
                value="list"
              >
                <List className="size-4" />
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-input/25 size-8 p-0 data-[state=active]:shadow-none"
                value="palette"
              >
                <LayoutGrid className="size-4" />
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />

          <TabsContent className="my-0 min-w-[300px]" value="list">
            <Command className="flex h-84 flex-col">
              <CommandInput
                className="h-10"
                placeholder="Search Tailwind colors..."
              />
              <ScrollArea className="flex-1 overflow-hidden">
                <CommandEmpty className="text-muted-foreground p-4 text-center">
                  No Tailwind color found.
                </CommandEmpty>

                {Object.entries(TAILWIND_PALETTE).map(([key, colors]) => {
                  const colorName = key.charAt(0).toUpperCase() + key.slice(1);
                  return (
                    <CommandGroup heading={colorName} key={key}>
                      {Object.entries(colors).map(([shade, color]) => {
                        const isSelected = isColorSelected(color);

                        return (
                          <CommandItem
                            className="flex items-center gap-2"
                            key={color}
                            onSelect={() => handleColorSelect(color)}
                          >
                            <ColorSwatch
                              color={color}
                              isSelected={isSelected}
                              name={`${key}-${shade}`}
                              size="md"
                            />
                            <span>{`${key}-${shade}`}</span>
                            {isSelected && (
                              <Check className="ml-auto size-4 opacity-70" />
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  );
                })}
              </ScrollArea>
            </Command>
          </TabsContent>

          <TabsContent className="my-0 w-full" value="palette">
            <ScrollArea className="h-84 w-full">
              <div className="flex flex-col gap-0.5 p-1">
                {Object.entries(TAILWIND_PALETTE).map(([key, colors]) => {
                  return (
                    <div className="flex gap-0.5" key={key}>
                      {Object.entries(colors).map(([shade, color]) => {
                        return (
                          <ColorSwatch
                            className="rounded-none"
                            color={color}
                            isSelected={isColorSelected(color)}
                            key={`${key}-${shade}`}
                            name={`${key}-${shade}`}
                            onClick={() => handleColorSelect(color)}
                            size="md"
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

interface ColorSwatchProps extends React.HTMLAttributes<HTMLButtonElement> {
  isSelected: boolean;
  color: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

function ColorSwatch({
  color,
  name,
  className,
  isSelected,
  size = "sm",
  ...props
}: ColorSwatchProps) {
  const sizeClasses = {
    sm: "size-5",
    md: "size-6",
    lg: "size-8",
  };
  return (
    <button
      aria-label={`Select color ${name}`}
      className={cn(
        "group relative cursor-pointer rounded-md border bg-(--color) transition-all hover:z-10 hover:scale-110 hover:shadow-lg",
        sizeClasses[size],
        isSelected && "ring-2 ring-(--color)",
        className
      )}
      style={{ "--color": color } as React.CSSProperties}
      title={name}
      {...props}
    >
      <div className="group-hover:ring-foreground/50 absolute inset-0 rounded-[inherit] ring-2 ring-transparent transition-all duration-200" />
    </button>
  );
}
