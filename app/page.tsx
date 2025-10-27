"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { Footer } from "@/components/footer";
import { AIGenerationCTA } from "@/components/home/ai-generation-cta";
import { CTA } from "@/components/home/cta";
import { FAQ } from "@/components/home/faq";
import { Features } from "@/components/home/features";
import { Header } from "@/components/home/header";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Roadmap } from "@/components/home/roadmap";
import { Testimonials } from "@/components/home/testimonials";
import { ThemePresetSelector } from "@/components/home/theme-preset-selector";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // useEffectEvent ensures the callback always accesses the latest state without causing effect re-runs
  const handleScroll = useEffectEvent(() => {
    if (window.scrollY > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-items-center bg-background text-foreground">
      <Header
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main className="w-full flex-1">
        <Hero />
        <ThemePresetSelector />
        <Testimonials />
        <Features />
        <AIGenerationCTA />
        <HowItWorks />
        <Roadmap />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
