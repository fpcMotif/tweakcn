import { Download, Github } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ZedHero() {
  return (
    <section className="relative isolate px-4 pt-20 pb-[12rem] sm:px-6 sm:pt-28 md:pb-[9.6rem] bg-gradient-to-t from-[#f0f4ff] dark:from-[#0a0a0a] to-white dark:to-[#0a0a0a] blueprint-grid">
      <div className="mx-auto w-full max-w-[720px] md:max-w-[1100px] flex flex-col items-center gap-8 animate-fade animate-ease-out animate-duration-[650ms]">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-center text-[#1a1a1a] dark:text-[#ffffff] tracking-tight leading-[1.1]">
          The editor for what&apos;s next
        </h1>
        <p className="text-lg md:text-xl text-center text-[#4a4a4a] dark:text-[#a0a0a0] max-w-2xl leading-relaxed">
          Zed is a next-generation code editor designed for high-performance
          collaboration with humans and AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button
            asChild
            className="h-12 px-6 rounded-lg bg-[#0066ff] hover:bg-[#0052cc] text-white font-medium shadow-lg shadow-[#0066ff]/25 transition-all duration-200"
            size="lg"
          >
            <Link href="#download">
              <Download className="mr-2 size-5" />
              Download now
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs">
                D
              </span>
            </Link>
          </Button>
          <Button
            asChild
            className="h-12 px-6 rounded-lg border-[#e0e0e0] dark:border-[#404040] bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-[#e5e5e5] font-medium shadow-sm"
            size="lg"
            variant="outline"
          >
            <Link href="#clone">
              <Github className="mr-2 size-5" />
              Clone source
              <span className="ml-2 px-2 py-0.5 bg-[#f0f0f0] dark:bg-[#2a2a2a] rounded text-xs">
                C
              </span>
            </Link>
          </Button>
        </div>
        <p className="text-sm text-[#6a6a6a] dark:text-[#909090]">
          Available for macOS, Linux, and Windows
        </p>
      </div>
    </section>
  );
}
