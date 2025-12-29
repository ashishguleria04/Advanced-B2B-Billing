"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { organizations, members, invitations, roleEnum } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createOrganization(name: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const [org] = await db.insert(organizations).values({
        name,
        plan: "free",
        subscriptionStatus: "incomplete"
    }).returning();

    await db.insert(members).values({
        userId: session.user.id,
        organizationId: org.id,
        role: "owner"
    });

    return org;
}

export async function inviteMember(email: string, orgId: string, role: "admin" | "member" = "member") {
    const session = await auth();
    // TODO: Add RBAC check (middleware or here)
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Check if inviter is owner/admin
    const memberRecord = await db.query.members.findFirst({
        where: and(eq(members.userId, session.user.id), eq(members.organizationId, orgId))
    });

    if (!memberRecord || (memberRecord.role !== "owner" && memberRecord.role !== "admin")) {
        throw new Error("Insufficient permissions");
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    await db.insert(invitations).values({
        email,
        organizationId: orgId,
        role,
        token,
        expiresAt
    });

    // In a real app, send email here
    return token;
}
