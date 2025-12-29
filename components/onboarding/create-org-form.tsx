"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrganization } from "@/actions/org";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function CreateOrganizationForm() {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createOrganization(name);
            router.refresh(); // Refresh to update server components
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to create organization", error);
            // In a real app, use toast here
            alert("Failed to create organization");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Create Organization</CardTitle>
                <CardDescription>
                    To get started, create a new organization for your team.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="orgName">Organization Name</Label>
                        <Input
                            id="orgName"
                            placeholder="Acme Corp"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            minLength={3}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Organization"
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
