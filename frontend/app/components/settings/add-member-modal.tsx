import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { TeamMemberRole, User } from "@/backend.types"
import { useState } from "react"

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (role: string) => void
  selectedUser: User | null
  isLoading: boolean
}

export function AddMemberModal({
  isOpen,
  onClose,
  onConfirm,
  selectedUser,
  isLoading
}: AddMemberModalProps) {
  const [selectedRole, setSelectedRole] = useState(TeamMemberRole.MEMBER)

  const handleConfirm = () => {
    onConfirm(selectedRole)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add {selectedUser?.firstName && selectedUser?.lastName
              ? `${selectedUser.firstName} ${selectedUser.lastName}`
              : selectedUser?.email
            } to your team
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="rounded-md border px-3 py-2 text-sm text-muted-foreground">
              {selectedUser?.email}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as TeamMemberRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TeamMemberRole.MEMBER}>Member</SelectItem>
                <SelectItem value={TeamMemberRole.ADMIN}>Admin</SelectItem>
                <SelectItem value={TeamMemberRole.OWNER}>Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 