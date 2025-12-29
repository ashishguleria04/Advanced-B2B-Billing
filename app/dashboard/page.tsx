import { auth } from "@/auth";
import { db } from "@/lib/db";
import { members } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { TeamManager } from "@/components/billing/team-manager";
import { PricingToggle } from "@/components/billing/pricing-toggle";
import { BillingPortalButton } from "@/components/billing/portal-button";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Not authenticated</div>;

  const member = await db.query.members.findFirst({
    where: eq(members.userId, session.user.id),
    with: {
        organization: {
            with: {
                members: {
                    with: {
                        user: true
                    }
                }
            }
        }
    }
  });

  if (!member) return <div>No organization found</div>;

  return (
    <div className="container mx-auto py-10 space-y-10">
      <h1 className="text-3xl font-bold">Dashboard: {member.organization.name}</h1>
      
      <section className="space-y-4">
          <h2 className="text-2xl font-bold">Subscription</h2>
          <div className="flex items-center gap-4">
              <p>Status: {member.organization.subscriptionStatus}</p>
              <BillingPortalButton />
          </div>
          <PricingToggle orgId={member.organization.id} />
      </section>

      <section>
          <TeamManager 
            members={member.organization.members} 
            orgId={member.organization.id} 
          />
      </section>
    </div>
  )
}
