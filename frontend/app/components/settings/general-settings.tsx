import { useState } from "react";
import { useMutation } from '@apollo/client/react/hooks/useMutation.js';
import { UPDATE_TEAM } from "@/lib/team.queries";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Team } from "@/backend.types";

interface GeneralSettingsProps {
  team: Team;
}

export function GeneralSettings({ team }: GeneralSettingsProps) {
  const [name, setName] = useState(team.name);

  const [updateTeam, { loading }] = useMutation(UPDATE_TEAM, {
    onCompleted: (data) => {
      if (data.updateTeam.error) {
        toast.error(data.updateTeam.error.message);
        return;
      }
      toast.success("Team updated successfully");
    },
    refetchQueries: ['GetTeams']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === team.name) return;

    await updateTeam({
      variables: {
        input: {
          id: team.id,
          name
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">General Settings</h2>
        <p className="text-sm text-muted-foreground">
          Update your team settings here.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Team Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !name.trim() || name === team.name}
        >
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </div>
  );
} 