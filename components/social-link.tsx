import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialLinkProps extends React.ComponentProps<"a"> {
  showIcon?: boolean;
}

export function SocialLink({
  href,
  children,
  className,
  showIcon = false,
}: SocialLinkProps) {
  return (
    <a
      className={cn(
        "text-foreground/60 hover:text-foreground inline-flex w-fit items-center transition-colors",
        className
      )}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
      {showIcon && (
        <ArrowUpRight className="size-3 transition group-hover/link:rotate-45" />
      )}
    </a>
  );
}
