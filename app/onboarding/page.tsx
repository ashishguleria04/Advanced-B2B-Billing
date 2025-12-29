import { auth } from "@/auth";
import { CreateOrganizationForm } from "@/components/onboarding/create-org-form";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { members } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function OnboardingPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    // Check if user already has an organization
    const existingMember = await db.query.members.findFirst({
        where: eq(members.userId, session.user.id)
    });

    if (existingMember) {
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-900 p-4">
            <CreateOrganizationForm />
        </div>
    );
}
