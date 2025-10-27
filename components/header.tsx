"use client";

import Link from "next/link";
import { useState } from "react";
import DiscordIcon from "@/assets/discord.svg";
import FigmaIcon from "@/assets/figma.svg";
import GitHubIcon from "@/assets/github.svg";
import Logo from "@/assets/logo.svg";
import TwitterIcon from "@/assets/twitter.svg";
import { FigmaExportDialog } from "@/components/figma-export-dialog";
import { SocialLink } from "@/components/social-link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";
import { useGithubStars } from "@/hooks/use-github-stars";
import { formatCompactNumber } from "@/utils/format";
import { GetProCTA } from "./get-pro-cta";

export function Header() {
  const { stargazersCount } = useGithubStars("jnsahaj", "tweakcn");
  const [figmaDialogOpen, setFigmaDialogOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="flex items-center gap-1">
          <Link className="flex items-center gap-2" href="/">
            <Logo className="size-6" title="tweakcn" />
            <span className="hidden font-bold md:block">tweakcn</span>
          </Link>
        </div>
        <div className="flex items-center gap-3.5">
          <GetProCTA className="h-8" />

          <SocialLink
            className="flex items-center gap-2 text-sm font-bold"
            href="https://github.com/jnsahaj/tweakcn"
          >
            <GitHubIcon className="size-4" />
            {stargazersCount > 0 && formatCompactNumber(stargazersCount)}
          </SocialLink>
          <Separator className="h-8" orientation="vertical" />
          <div className="flex items-center gap-3.5">
            <div className="hidden items-center gap-3.5 md:flex">
              <SocialLink href="https://discord.gg/Phs4u2NM3n">
                <DiscordIcon className="size-5" />
              </SocialLink>
            </div>
            <SocialLink href="https://x.com/iamsahaj_xyz">
              <TwitterIcon className="size-4" />
            </SocialLink>
          </div>
          <Separator className="h-8" orientation="vertical" />
          <Button
            className="flex h-8 items-center gap-2"
            onClick={() => setFigmaDialogOpen(true)}
            variant="outline"
          >
            <FigmaIcon className="size-4" />
            Export to Figma
          </Button>
          <UserProfileDropdown />
        </div>
      </div>

      <FigmaExportDialog
        onOpenChange={setFigmaDialogOpen}
        open={figmaDialogOpen}
      />
    </header>
  );
}
