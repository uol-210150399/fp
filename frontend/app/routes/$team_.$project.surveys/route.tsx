import { useParams } from "@remix-run/react";
import { SurveyCard } from "@/components/survey-card";
import { EmptyState } from "@/components/empty-state";
import { useState, useMemo, Fragment } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSurveys } from "@/hooks/use-surveys";
import { CreateSurveyDialog } from "@/components/create-survey-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";

export default function Surveys() {
  const { project: projectId, team: teamSlug } = useParams();
  const [createSurveyOpen, setCreateSurveyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { surveys, loading, error } = useSurveys(projectId!);

  const filteredSurveys = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return surveys;
    return surveys.filter(survey =>
      survey.title.toLowerCase().includes(query)
    );
  }, [surveys, searchQuery]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!surveys.length) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col">
        <EmptyState
          title="No surveys yet"
          description="Create your first survey to get started"
          buttonText="Create survey"
          onCreateClick={() => setCreateSurveyOpen(true)}
        />
        <CreateSurveyDialog
          open={createSurveyOpen}
          onOpenChange={setCreateSurveyOpen}
          projectId={projectId!}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <SidebarInset >
        <header className="flex h-16 shrink-0 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Surveys</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Button size="sm" onClick={() => setCreateSurveyOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Survey
          </Button>
        </header>

      </SidebarInset >
      <div className="flex h-[calc(100vh-4rem)] flex-col">


        {/* Search Bar */}
        < div className="bg-background border-b-alpha-50 border-t border-b border-t-alpha-50 border-b-alpha-50 mx-auto flex h-[50px] w-full shrink-0 items-center px-4" >
          <div className="w-full min-w-0 overflow-x-hidden">
            <form className="flex h-[22px] flex-1 items-center justify-start gap-2">
              <label className="pointer-events-none flex items-center justify-center rounded-lg" htmlFor="search-surveys">
                <MagnifyingGlassIcon className="size-4 !text-gray-500" />
                <span className="sr-only">Search</span>
              </label>
              <input
                id="search-surveys"
                type="search"
                className="focus-visible:border-alpha-600 disabled:border-alpha-300 bg-background inline-flex shrink-0 border py-1 text-sm outline-none transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 h-full w-full rounded-lg border-none px-1 shadow-none [&::-webkit-search-cancel-button]:appearance-none"
                placeholder="Search for a survey..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div >

        < div className="flex-1 overflow-auto" >
          <div className="mx-auto w-full px-6 py-6">
            <div className="grid gap-6 md:grid-cols-1">
              {filteredSurveys.map((survey) => (
                <SurveyCard
                  key={survey.id}
                  survey={survey}
                  teamSlug={teamSlug!}
                />
              ))}
            </div>
          </div>
        </div >

        <CreateSurveyDialog
          open={createSurveyOpen}
          onOpenChange={setCreateSurveyOpen}
          projectId={projectId!}
        />
      </div >
    </div >
  );
}