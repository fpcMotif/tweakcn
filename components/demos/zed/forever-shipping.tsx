import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ZedForeverShipping() {
  return (
    <section className="relative px-4 py-12 sm:px-6 md:py-20 bg-[#fefbf3] dark:bg-[#0a0a0a] blueprint-grid">
      <div className="mx-auto w-full max-w-[1100px] flex flex-col items-center gap-8">
        <div className="text-xs uppercase tracking-wider text-[#6a6a6a] dark:text-[#909090] font-semibold mb-2">
          FOREVER SHIPPING
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#0066ff] dark:text-[#4da6ff] mb-4">
          Zed just works
        </h2>
        <p className="text-lg text-center text-[#4a4a4a] dark:text-[#a0a0a0] max-w-2xl">
          Incredibly powerful out of the box. And it only gets better as, every
          week, there&apos;s always a new version.
        </p>
        <Button
          asChild
          className="h-12 px-6 rounded-lg border-[#e0e0e0] dark:border-[#404040] bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-[#e5e5e5] font-medium shadow-md hover:shadow-lg transition-all duration-200"
          variant="outline"
        >
          <Link href="#releases">
            View all releases
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
