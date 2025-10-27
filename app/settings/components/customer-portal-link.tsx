import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { polar } from "@/lib/polar";
import { cn } from "@/lib/utils";

export async function CustomerPortalLink() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user.id) {
    return null;
  }

  const result = await polar.customerSessions.create({
    externalCustomerId: session?.user.id,
  });

  const customerPortalLink = result.customerPortalUrl;

  return (
    <Link
      className={cn(
        "hover:bg-muted flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
      )}
      href={customerPortalLink}
      key="customer-portal"
    >
      Manage Subscription
    </Link>
  );
}
