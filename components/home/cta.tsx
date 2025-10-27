import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden isolate">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(from_var(--primary-foreground)_r_g_b_/_0.075)_1px,transparent_1px),linear-gradient(to_bottom,rgba(from_var(--primary-foreground)_r_g_b_/_0.075)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-foreground/15 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute -bottom-24 -right-24 w-64 h-64 bg-foreground/15 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1.5s" }}
      ></div>

      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          className="flex flex-col items-center justify-center space-y-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Ready to Make Your Components Stand Out?
          </motion.h2>
          <motion.p
            className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Start customizing your shadcn/ui components today and create a
            unique look for your application.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-4"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Link href="/editor/theme">
              <Button
                className="rounded-full h-12 px-8 text-base cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
                size="lg"
                variant="secondary"
              >
                Try It Now
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="https://github.com/jnsahaj/tweakcn">
              <Button
                className="rounded-full bg-transparent h-12 px-8 text-base transition-all duration-300 hover:translate-y-[-2px]"
                size="lg"
                variant="outline"
              >
                View on GitHub
              </Button>
            </Link>
          </motion.div>
          <motion.p
            className="text-sm text-primary-foreground/80 mt-4"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1 }}
          >
            No login required. Free to use. Open source.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
