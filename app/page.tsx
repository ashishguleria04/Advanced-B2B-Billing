import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Check, Shield, Users, Zap, Globe, BarChart } from "lucide-react";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="px-6 h-16 flex items-center justify-between border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
            <span className="text-white dark:text-black font-mono">B</span>
          </div>
          <span>B2B Billing</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href={session ? "/dashboard" : "/login"}>
            <Button>{session ? "Go to Dashboard" : "Get Started"}</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-6 text-center space-y-6 bg-gradient-to-b from-background to-muted/20">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
            Now with Usage-Based Billing
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
            The Complete <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">B2B Billing Engine</span> for Next.js
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Production-ready infrastructure for SaaS. Multi-tenancy, team management, and advanced Stripe integration out of the box.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
             <Link href={session ? "/dashboard" : "/login"}>
              <Button size="lg" className="h-12 px-8">Start Building</Button>
            </Link>
             <Link href="https://github.com/ashishguleria04/Advanced-B2B-Billing">
              <Button size="lg" variant="outline" className="h-12 px-8">View Code</Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-16">Enterprise-Grade Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Users className="w-6 h-6 text-blue-500" />}
                title="Multi-Tenancy"
                description="Built-in organization support. Users can create teams, invite members, and manage roles."
              />
              <FeatureCard 
                icon={<Zap className="w-6 h-6 text-yellow-500" />}
                title="Usage-Based Billing"
                description="Metered billing implementation correctly reporting usage events to Stripe."
              />
              <FeatureCard 
                icon={<Shield className="w-6 h-6 text-green-500" />}
                title="Secure by Default"
                description="Role-based access control (RBAC), secure sessions, and protected server actions."
              />
              <FeatureCard 
                icon={<Globe className="w-6 h-6 text-purple-500" />}
                title="Customer Portal"
                description="Self-serve billing portal for customers to manage invoices and subscriptions."
              />
              <FeatureCard 
                icon={<BarChart className="w-6 h-6 text-orange-500" />}
                title="Webhooks Engine"
                description="Resilient webhook handling for subscription updates, payments, and cancellations."
              />
              <FeatureCard 
                icon={<Check className="w-6 h-6 text-indigo-500" />}
                title="Type Safe"
                description="End-to-end type safety with TypeScript, Drizzle ORM, and Zod validation."
              />
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-6">Built for Scale</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Handling complex pricing models so you don&apos;t have to. Support for tiered, flat-rate, and metered usage.
            </p>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <CardDescription>For growing teams</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">$10<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Up to 5 team members</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Basic analytics</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Community support</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-primary shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg">
                  Popular
                </div>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For serious business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">$49<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Unlimited team members</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Advanced Usage Reporting</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Priority Support</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 border-t bg-muted/10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2025 B2B Billing Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
            <Link href="https://github.com/ashishguleria04/Advanced-B2B-Billing" className="hover:text-foreground">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-none bg-background/50">
      <CardHeader>
        <div className="mb-4 p-3 bg-muted rounded-lg w-fit">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base mt-2">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
