"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "../ui/revola";

const formSchema = z.object({
  themeName: z.string().min(1, "Theme name cannot be empty."),
});

interface ThemeSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (themeName: string) => Promise<void>;
  isSaving: boolean;
  initialThemeName?: string;
  ctaLabel?: string;
  title?: string;
  description?: string;
}

export function ThemeSaveDialog({
  open,
  onOpenChange,
  onSave,
  isSaving,
  initialThemeName = "",
  ctaLabel = "Save Theme",
  title = "Save Theme",
  description = "Enter a name for your theme so you can find it later.",
}: ThemeSaveDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      themeName: initialThemeName,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values.themeName);
  };

  useEffect(() => {
    if (open) {
      form.reset({ themeName: initialThemeName });
    }
  }, [open, initialThemeName, form]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  return (
    <ResponsiveDialog onOpenChange={handleOpenChange} open={open}>
      <ResponsiveDialogContent className="overflow-hidden shadow-lg sm:max-w-100">
        <div className="space-y-6 p-6 pt-0 sm:pt-6 sm:pb-2">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {description}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="themeName"
                render={({ field }) => (
                  <FormItem className="grid">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Theme" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <ResponsiveDialogFooter className="bg-muted/30 border-t px-6 py-4">
          <Button
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
            size="sm"
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            disabled={
              isSaving || !form.formState.isValid || form.formState.isSubmitting
            }
            onClick={form.handleSubmit(onSubmit)}
            size="sm"
            type="submit"
          >
            {isSaving || form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-1 size-4 animate-spin" />
                Saving
              </>
            ) : (
              ctaLabel
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
