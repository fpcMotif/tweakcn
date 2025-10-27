"use client";

import { Gem } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";

interface GetProCTAProps extends React.ComponentProps<typeof Button> {}

export function GetProCTA({ className, ...props }: GetProCTAProps) {
  const { subscriptionStatus, isPending } = useSubscription();
  const isPro = subscriptionStatus?.isSubscribed ?? false;

  if (isPending || isPro) {
    return null;
  }

  return (
    <Button
      asChild
      className={cn(
        "text-primary animate-in fade-in-50 bg-primary/10 hover:bg-primary hover:text-primary-foreground shadow-none duration-300",
        className
      )}
      variant="ghost"
      {...props}
    >
      <Link href="/pricing">
        <Gem />
        Get Pro
      </Link>
    </Button>
  );
}
