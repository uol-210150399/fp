import { useState } from "react";
import { useMutation } from '@apollo/client/react/hooks/useMutation.js';
import { ADD_TEAM_MEMBER, REMOVE_TEAM_MEMBER } from "@/lib/team.queries";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Check, ChevronsUpDown } from "lucide-react";
import { Team, TeamMemberRole } from "@/backend.types";
import { useUsers } from "@/hooks/use-users";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { AddMemberModal } from "./add-member-modal"

interface MembersSettingsProps {
  team: Team;
}

export function MembersSettings({ team }: MembersSettingsProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedUserId, setSelectedUserId] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const { userId } = useAuth();

  const { users, loading: loadingUsers } = useUsers(search);
  const availableUsers = users.filter(user =>
    // Exclude current user and existing team members
    user.id !== userId &&
    !team.members?.some(member => member.id === user.id)
  );

  const selectedUser = users.find(user => user.id === selectedUserId);

  const [addMember, { loading: addingMember }] = useMutation(ADD_TEAM_MEMBER, {
    onCompleted: (data) => {
      if (data.createTeamMember.error) {
        toast.error(data.createTeamMember.error.message);
        return;
      }
      toast.success("Member added successfully");
      setSelectedUserId("");
      setOpen(false);
    },
    refetchQueries: ['GetTeams']
  });

  const [removeMember, { loading: removingMember }] = useMutation(REMOVE_TEAM_MEMBER, {
    onCompleted: (data) => {
      if (data.removeTeamMember.error) {
        toast.error(data.removeTeamMember.error.message);
        return;
      }
      toast.success("Member removed successfully");
    },
    refetchQueries: ['GetTeams']
  });

  const handleAddMember = async (role: string) => {
    await addMember({
      variables: {
        input: {
          teamId: team.id,
          userId: selectedUserId,
          role
        }
      }
    });
    setShowAddModal(false);
  };

  const handleRemoveMember = async (memberId: string) => {
    await removeMember({
      variables: {
        input: {
          id: memberId
        }
      }
    });
  };

  const teamMembersWithInfo = team.members?.map(member => {
    const user = users.find(u => u.id === member.userId);
    return {
      ...member,
      ...user,
      displayName: user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.email || member.id,
      id: member.id
    }
  }).sort((a, b) => {
    // Sort by role first (OWNER first, then ADMIN, then MEMBER)
    const roleOrder = { OWNER: 0, ADMIN: 1, MEMBER: 2 };
    const roleCompare = (roleOrder[a.role] || 999) - (roleOrder[b.role] || 999);
    if (roleCompare !== 0) return roleCompare;

    // Then sort by name
    return (a.displayName || '').localeCompare(b.displayName || '');
  });

  const currentUserIsOwner = team.members?.some(member => member.userId === userId && member.role === TeamMemberRole.OWNER);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Team Members</h2>
        <p className="text-sm text-muted-foreground">
          Manage your team members here.
        </p>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        if (selectedUserId) {
          setShowAddModal(true);
        }
      }} className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="user-select" className="sr-only">Select User</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedUserId ?
                    (users.find(user => user.id === selectedUserId)?.firstName &&
                      users.find(user => user.id === selectedUserId)?.lastName)
                      ? `${users.find(user => user.id === selectedUserId)?.firstName} ${users.find(user => user.id === selectedUserId)?.lastName}`
                      : users.find(user => user.id === selectedUserId)?.email
                    : "Select user..."
                  }
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search users..."
                    onValueChange={setSearch}
                  />
                  <CommandEmpty>No users found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {availableUsers.map(user => (
                        <CommandItem
                          key={user.id}
                          value={user.id}
                          onSelect={() => {
                            setSelectedUserId(user.id)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedUserId === user.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName} (${user.email})`
                            : user.email
                          }
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <Button type="submit" disabled={!selectedUserId}>
            Add Member
          </Button>
        </div>
      </form>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembersWithInfo.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div>
                    {member.displayName}
                    <div className="text-sm text-muted-foreground">
                      {member.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {(currentUserIsOwner && member.userId !== userId) &&
                    (currentUserIsOwner || member.role !== TeamMemberRole.OWNER) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={removingMember}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove member</span>
                      </Button>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleAddMember}
        selectedUser={selectedUser || null}
        isLoading={addingMember}
      />
    </div>
  );
} 