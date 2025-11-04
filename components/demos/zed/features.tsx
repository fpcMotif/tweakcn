import { Brain, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Fast",
    description:
      "Written from scratch in Rust to efficiently leverage multiple CPU cores and your GPU.",
  },
  {
    icon: Brain,
    title: "Intelligent",
    description:
      "Integrate upcoming LLMs into your workflow to generate, transform, and analyze code.",
  },
  {
    icon: Users,
    title: "Collaborative",
    description:
      "Chat with teammates, write notes together, and share your screen and project. All included.",
  },
];

export function ZedFeatures() {
  return (
    <section className="relative px-4 py-12 sm:px-6 md:py-20 bg-white dark:bg-[#0a0a0a]">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                className="border-[#e8e8e8] dark:border-[#404040] bg-white dark:bg-[#1a1a1a] shadow-sm"
                key={index}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-[#0066ff]/10 text-[#0066ff]">
                      <Icon className="size-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-[#1a1a1a] dark:text-[#e5e5e5]">
                        {feature.title}
                      </h3>
                      <p className="text-[#6a6a6a] dark:text-[#909090] leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
