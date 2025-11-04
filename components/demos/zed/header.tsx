"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ZedHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e8e8e8] dark:border-[#404040] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-4 sm:px-6">
        <Link className="flex items-center gap-2" href="/demos/zed">
          <span className="text-xl font-bold text-[#1a1a1a] dark:text-[#e5e5e5]">
            Zed
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            className="text-sm text-[#4a4a4a] dark:text-[#a0a0a0] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5] transition-colors"
            href="#product"
          >
            Product
          </Link>
          <Link
            className="text-sm text-[#4a4a4a] dark:text-[#a0a0a0] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5] transition-colors"
            href="#extensions"
          >
            Extensions
          </Link>
          <Link
            className="text-sm text-[#4a4a4a] dark:text-[#a0a0a0] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5] transition-colors"
            href="#docs"
          >
            Docs
          </Link>
          <Link
            className="text-sm text-[#4a4a4a] dark:text-[#a0a0a0] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5] transition-colors"
            href="#blog"
          >
            Blog
          </Link>
          <Link
            className="text-sm text-[#4a4a4a] dark:text-[#a0a0a0] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5] transition-colors"
            href="#pricing"
          >
            Pricing
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button
            asChild
            className="text-[#4a4a4a] dark:text-[#a0a0a0] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5]"
            variant="ghost"
          >
            <Link href="#signup">Sign up</Link>
          </Button>
          <Button
            asChild
            className="bg-[#0066ff] hover:bg-[#0052cc] text-white"
          >
            <Link href="#download">Download</Link>
          </Button>
        </div>

        <Button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
          variant="ghost"
        >
          {mobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e8e8e8] dark:border-[#404040] bg-white dark:bg-[#0a0a0a]">
          <nav className="flex flex-col gap-4 p-4">
            <Link
              className="text-sm text-[#4a4a4a] dark:text-[#a0a0a0] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5]"
              href="#product"
            >
              Product
            </Link>
            <Link
              className="text-sm text-[#4a4a4a] dark:text-[#a0a0a0] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5]"
              href="#extensions"
            >
              Extensions
            </Link>
            <Link
              className="text-sm text-[#4a4a4a] dark:text-[#a0a0a0] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5]"
              href="#docs"
            >
              Docs
            </Link>
            <Link
              className="text-sm text-[#4a4a4a] dark:text-[#a0a0a0] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5]"
              href="#blog"
            >
              Blog
            </Link>
            <Link
              className="text-sm text-[#4a4a4a] dark:text-[#a0a0a0] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5]"
              href="#pricing"
            >
              Pricing
            </Link>
            <div className="flex gap-4 pt-4 border-t border-[#e8e8e8] dark:border-[#404040]">
              <Button
                asChild
                className="flex-1 text-[#4a4a4a] dark:text-[#a0a0a0]"
                variant="ghost"
              >
                <Link href="#signup">Sign up</Link>
              </Button>
              <Button
                asChild
                className="flex-1 bg-[#0066ff] hover:bg-[#0052cc] text-white"
              >
                <Link href="#download">Download</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
