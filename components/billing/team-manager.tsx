"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { inviteMember } from "@/actions/org"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

type Member = {
    id: string;
    role: string;
    organizationId: string;
    user: {
        name: string | null;
        email: string;
    }
}

export function TeamManager({ members, orgId }: { members: Member[], orgId: string }) {
  const [inviteEmail, setInviteEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleInvite = async () => {
      try {
          setIsLoading(true)
          await inviteMember(inviteEmail, orgId)
          setOpen(false)
          setInviteEmail("")
          // In a real app we'd toast success
          router.refresh()
      } catch (error) {
          console.error(error)
      } finally {
          setIsLoading(false)
      }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Team Members</h2>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Invite Member</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite a team member</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Input 
                        placeholder="email@example.com" 
                        value={inviteEmail} 
                        onChange={(e) => setInviteEmail(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button onClick={handleInvite} disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send Invite"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.user.name || "Unknown"}</TableCell>
              <TableCell>{member.user.email}</TableCell>
              <TableCell className="capitalize">{member.role}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">Manage</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
