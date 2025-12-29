import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { organizations } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        return new NextResponse("Webhook Error", { status: 400 });
    }

    const session = event.data.object as any; // Type assertion for generic handling

    try {
        switch (event.type) {
            case "customer.subscription.updated":
            case "customer.subscription.created": {
                // Sync subscription status
                const subscription = event.data.object;
                const customerId = subscription.customer as string;
                const status = subscription.status;
                const planId = subscription.items.data[0].price.id; // Simplified

                await db
                    .update(organizations)
                    .set({
                        subscriptionStatus: status,
                        plan: planId
                    })
                    .where(eq(organizations.stripeCustomerId, customerId));
                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object;
                const customerId = subscription.customer as string;

                await db
                    .update(organizations)
                    .set({ subscriptionStatus: "canceled" })
                    .where(eq(organizations.stripeCustomerId, customerId));
                break;
            }
            case "invoice.payment_failed": {
                // Can implement logic to notify user or mark as past_due
                const invoice = event.data.object;
                const customerId = invoice.customer as string;
                await db
                    .update(organizations)
                    .set({ subscriptionStatus: "past_due" })
                    .where(eq(organizations.stripeCustomerId, customerId));
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error) {
        console.error("Webhook handler failed", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

    return new NextResponse(null, { status: 200 });
}
