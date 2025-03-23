import { Button } from "@/components/ui/button";
import { useNavigate } from "@remix-run/react";
import { Home } from "lucide-react";

export function InvalidTeam() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Invalid Team</h1>
        <p className="mt-2 text-muted-foreground">
          The team you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="mt-4"
          variant="outline"
        >
          <Home className="mr-2 h-4 w-4" />
          Go Home
        </Button>
      </div>
    </div>
  );
} 