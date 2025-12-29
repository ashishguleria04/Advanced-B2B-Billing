"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { organizations, members, invitations } from "@/lib/schema";
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
    if (!session?.user?.id) throw new Error("Unauthorized");

    const memberRecord = await db.query.members.findFirst({
        where: and(eq(members.userId, session.user.id), eq(members.organizationId, orgId))
    });

    if (!memberRecord || (memberRecord.role !== "owner" && memberRecord.role !== "admin")) {
        throw new Error("Insufficient permissions");
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await db.insert(invitations).values({
        email,
        organizationId: orgId,
        role,
        token,
        expiresAt,
        status: "pending"
    });

    return token;
}

export async function removeMember(memberId: string, orgId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const currentUserMember = await db.query.members.findFirst({
        where: and(eq(members.userId, session.user.id), eq(members.organizationId, orgId))
    });

    if (!currentUserMember || currentUserMember.role !== "owner") {
        // Only owners can remove for now suitable for demo
        throw new Error("Insufficient permissions");
    }

    await db.delete(members).where(and(eq(members.id, memberId), eq(members.organizationId, orgId)));

    revalidatePath(`/dashboard/${orgId}/team`);
}
