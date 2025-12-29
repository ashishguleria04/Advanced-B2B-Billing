"use server";

import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { organizations, members } from "@/lib/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function createPortalSession() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Fetch user's organization (first one found for now)
    const member = await db.query.members.findFirst({
        where: eq(members.userId, session.user.id),
        with: { organization: true }
    });

    if (!member || !member.organization.stripeCustomerId) {
        throw new Error("No billing account found");
    }

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: member.organization.stripeCustomerId,
        return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    });

    redirect(portalSession.url);
}

export async function createCheckoutSession(priceId: string, orgId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Verify org access
    const member = await db.query.members.findFirst({
        where: eq(members.organizationId, orgId)
    });
    // Strict RBAC would go here

    // Create session
    const checkoutSession = await stripe.checkout.sessions.create({
        customer_email: session.user.email!,
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`,
        metadata: {
            orgId: orgId
        }
    });

    redirect(checkoutSession.url!);
}
