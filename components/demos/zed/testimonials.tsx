import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "I've had my mind blown using Zed with Claude 3.5 Sonnet. I wrote up a few sentences around a research idea and Claude 3.5 Sonnet delivered a first pass in seconds. When I spotted some small mistakes, I highlighted the parts I wanted to change and shared feedback for it to fix. I was able to go from idea to running experiment code in half an hour—it was really easy and fun.",
    author: "Ethan Perez",
    role: "Adversarial Robustness Research Lead",
    avatar: "https://via.placeholder.com/40",
    company: "ANTHROPIC",
  },
  {
    quote:
      "Yes! Now I can have shortcuts to run and debug tests. Ever since snippets were added, Zed has all of the features I could ask for in an editor.",
    author: "José Valim",
    role: "Creator of Elixir",
    avatar: "https://via.placeholder.com/40",
  },
  {
    quote:
      "This is obviously a product built with love and care. I can tell it from two minutes of using it. Kudos to the team.",
    author: "Dan Abramov",
    role: "Engineer and React Core team member",
    avatar: "https://via.placeholder.com/40",
  },
  {
    quote:
      "My god it is so fast. Boot time, UI interaction, typing latency. I feel it. I knew VS Code always felt sluggish, but I didn't realize how good things could really be. I'm honestly astounded.",
    author: "Matt Baker",
    role: "Principal Engineer",
    avatar: "https://via.placeholder.com/40",
  },
  {
    quote:
      "I've started using Zed, and I love it. Lots of subtle innovations (multibuffers, inlay hints, collaboration). Thoughtful, precise design. And the speed, the speed!",
    author: "Mike Bostock",
    role: "Creator of D3.js, founder of Observable",
    avatar: "https://via.placeholder.com/40",
  },
];

export function ZedTestimonials() {
  return (
    <section className="relative px-4 py-12 sm:px-6 md:py-20 bg-gradient-to-b from-[#f8fafc] via-[#fefbf3] to-white dark:from-[#0a0a0a] dark:via-[#0a0a0a] dark:to-[#0a0a0a] blueprint-grid">
      <div className="mx-auto w-full max-w-[1100px]">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#1a1a1a] dark:text-[#ffffff]">
          World-class developers use Zed
        </h2>
        <p className="text-center text-[#6a6a6a] dark:text-[#909090] mb-12">
          Trusted by industry-leading teams.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              className="relative flex w-full flex-col justify-between gap-8 p-6 square-gradient-bg square-gradient-bg-sh-alt rounded-sm border-[#e8e8e8] dark:border-[#404040] bg-[#fefbf3] dark:bg-[#1a1a1a] shadow-md hover:shadow-lg transition-all duration-200"
              key={index}
            >
              <CardContent className="p-0">
                {testimonial.company && (
                  <div className="mb-4 text-xs font-bold uppercase text-[#0066ff] dark:text-[#4da6ff]">
                    {testimonial.company}
                  </div>
                )}
                <blockquote className="text-[#1a1a1a] dark:text-[#e5e5e5] mb-6 leading-relaxed text-sm">
                  {testimonial.quote}
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage
                      alt={testimonial.author}
                      src={testimonial.avatar}
                    />
                    <AvatarFallback>
                      {testimonial.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-[#1a1a1a] dark:text-[#ffffff]">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-[#6a6a6a] dark:text-[#909090]">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
