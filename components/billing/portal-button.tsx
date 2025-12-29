"use client"

import { Button } from "@/components/ui/button"
import { createPortalSession } from "@/actions/billing"

export function BillingPortalButton() {
  return (
    <Button 
        variant="outline" 
        onClick={() => createPortalSession()}
    >
      Manage Subscription
    </Button>
  )
}
