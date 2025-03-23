import { useState } from "react";
import { useMutation } from '@apollo/client/react/hooks/useMutation.js';
import { ADD_TEAM_MEMBER, REMOVE_TEAM_MEMBER } from "@/lib/team.queries";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
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
import { Trash2 } from "lucide-react";
import { Team } from "@/backend.types";

interface MembersSettingsProps {
  team: Team;
}

export function MembersSettings({ team }: MembersSettingsProps) {
  const [email, setEmail] = useState("");

  const [addMember, { loading: addingMember }] = useMutation(ADD_TEAM_MEMBER, {
    onCompleted: (data) => {
      if (data.addTeamMember.error) {
        toast.error(data.addTeamMember.error.message);
        return;
      }
      toast.success("Member added successfully");
      setEmail("");
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

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    await addMember({
      variables: {
        input: {
          teamId: team.id,
          email
        }
      }
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    await removeMember({
      variables: {
        input: {
          teamId: team.id,
          memberId
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Team Members</h2>
        <p className="text-sm text-muted-foreground">
          Manage your team members here.
        </p>
      </div>

      <form onSubmit={handleAddMember} className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="email" className="sr-only">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Add member by email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={addingMember}
            />
          </div>
          <Button type="submit" disabled={addingMember || !email.trim()}>
            Add Member
          </Button>
        </div>
      </form>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.members?.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.id}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={removingMember}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove member</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 