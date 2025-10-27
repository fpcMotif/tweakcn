"use client";

import { BookLock, Gem, Loader2, LogOut, Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSubscription } from "@/hooks/use-subscription";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";

export function UserProfileDropdown() {
  const { data: session, isPending } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();
  const posthog = usePostHog();
  const router = useRouter();

  const { subscriptionStatus } = useSubscription();
  const isPro = subscriptionStatus?.isSubscribed ?? false;

  const handleLogOut = async () => {
    posthog.reset();
    await authClient.signOut();
    router.refresh();
  };

  return (
    <AnimatePresence mode="wait">
      {isPending ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="flex size-8 items-center justify-center"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key="spinner"
          transition={{ duration: 0.2 }}
        >
          <Loader2 className="text-muted-foreground size-7 animate-spin" />
        </motion.div>
      ) : !session?.user ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="flex gap-3.5"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key="auth-buttons"
          transition={{ duration: 0.2 }}
        >
          <Button
            className="text-foreground hover:text-primary h-8 px-0 hover:no-underline"
            onClick={() => openAuthDialog("signin")}
            variant="link"
          >
            Sign In
          </Button>
          <Button className="h-8" onClick={() => openAuthDialog("signup")}>
            Sign Up
          </Button>
        </motion.div>
      ) : (
        <motion.div
          animate={{ opacity: 1 }}
          className="flex"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key="user-dropdown"
          transition={{ duration: 0.2 }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="0 relative isolate size-8 rounded-full"
                variant="ghost"
              >
                <Avatar className="size-8">
                  <AvatarImage
                    alt={session.user.name || ""}
                    src={session.user.image || ""}
                  />
                  <AvatarFallback>
                    {session.user.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>

                {isPro && (
                  <div className="bg-accent absolute top-0 left-0 z-1 flex size-4 -translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full">
                    <Gem className="text-accent-foreground size-3!" />
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm leading-tight font-medium">
                    {session.user.name}{" "}
                    {isPro && (
                      <span className="bg-accent text-accent-foreground inline-flex w-fit items-center gap-1 rounded-md px-1 py-0.5 text-xs leading-tight font-medium">
                        <Gem className="size-2.5" /> Pro
                      </span>
                    )}
                  </p>
                  <p className="text-muted-foreground text-xs leading-tight">
                    {session.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border opacity-80" />
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border opacity-80" />
              <DropdownMenuItem asChild>
                <Link href="/privacy-policy">
                  <BookLock />
                  Privacy Policy
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogOut}>
                <LogOut /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
