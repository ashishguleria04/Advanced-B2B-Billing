"use client"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/actions/billing"

export function PricingToggle({ orgId }: { orgId: string }) {
  const [isYearly, setIsYearly] = useState(false)
  
  const handleUpgrade = async (priceId: string) => {
      await createCheckoutSession(priceId, orgId);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center space-x-4">
        <Label htmlFor="billing-mode" className={!isYearly ? "font-bold" : ""}>Monthly</Label>
        <Switch id="billing-mode" checked={isYearly} onCheckedChange={setIsYearly} />
        <Label htmlFor="billing-mode" className={isYearly ? "font-bold" : ""}>Yearly (Save 20%)</Label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <Card>
            <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>For small teams</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">$0</div>
            </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="border-primary">
           <CardHeader>
               <CardTitle>Pro</CardTitle>
               <CardDescription>Advanced features</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="text-3xl font-bold">{isYearly ? "$100/yr" : "$19/mo"}</div>
             <ul className="mt-4 space-y-2 text-sm">
                 <li>Unlimited members</li>
                 <li>Advanced analytics</li>
             </ul>
           </CardContent>
           <CardFooter>
             <Button className="w-full" onClick={() => handleUpgrade(isYearly ? 'price_pro_yearly' : 'price_pro_monthly')}>
               Upgrade to Pro
             </Button>
           </CardFooter>
        </Card>
      </div>
    </div>
  )
}
