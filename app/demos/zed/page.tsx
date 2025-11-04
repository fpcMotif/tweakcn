import type { Metadata } from "next";
import { ZedFeatures } from "@/components/demos/zed/features";
import { ZedFooter } from "@/components/demos/zed/footer";
import { ZedForeverShipping } from "@/components/demos/zed/forever-shipping";
import { ZedHeader } from "@/components/demos/zed/header";
import { ZedHero } from "@/components/demos/zed/hero";
import { ZedNewsBanner } from "@/components/demos/zed/news-banner";
import { ZedTestimonials } from "@/components/demos/zed/testimonials";

export const metadata: Metadata = {
  title: "Zed Demo — tweakcn",
  description: "A demo recreation of the Zed code editor landing page",
};

export default function ZedDemoPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-white dark:bg-[#0a0a0a] text-foreground">
      <ZedNewsBanner />
      <ZedHeader />
      <main className="w-full flex-1">
        <ZedHero />
        <ZedFeatures />
        <ZedTestimonials />
        <ZedForeverShipping />
      </main>
      <ZedFooter />
    </div>
  );
}
