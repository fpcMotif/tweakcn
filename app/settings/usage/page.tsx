import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UsageStats } from "@/app/settings/components/usage-stats";
import { auth } from "@/lib/auth";
import { SettingsHeader } from "../components/settings-header";

export default async function UsagePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/editor/theme");

  return (
    <div>
      <SettingsHeader
        description="Track your AI theme generation requests"
        title="AI Usage"
      />
      <UsageStats />
    </div>
  );
}
