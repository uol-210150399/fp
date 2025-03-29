import { ClientLoaderFunctionArgs, useLoaderData, useParams, useSearchParams } from "@remix-run/react";
import { useSurvey } from "@/hooks/use-surveys";
import { AirplayIcon, DownloadCloudIcon, ArchiveIcon, LinkIcon, SaveIcon, MoreHorizontalIcon, PenLineIcon, UsersIcon, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { SurveySetup } from "./components/survey-setup";
import { TooltipContent } from "@/components/ui/tooltip";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BreadcrumbList } from "@/components/ui/breadcrumb";
import { SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { SurveyForm } from "./components/survey-form";
import { usePublishSurvey } from "@/hooks/use-survey-mutations"
import { Link } from "@remix-run/react";
import { useProject, useTeam } from "@/hooks/use-teams";
import { useAuth, useClerk, useSignIn } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { SurveyRespondents } from "./components/survey-respondents";
import { SurveyUrlDialog } from "./components/survey-url-dialog"
import { toast } from "sonner";

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const { id } = params;
  return { id, teamId: params.team, projectId: params.project };
};

export default function SurveyDetail() {
  const { id, teamId, projectId } = useLoaderData<typeof clientLoader>();
  const { survey, loading, error } = useSurvey(id!);
  const [publishSurvey, { loading: isPublishing }] = usePublishSurvey();

  const { team } = useTeam(teamId!);
  const { project } = useProject(teamId!, projectId!);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("t") ?? "questions";
  const tabs = useMemo(
    () =>
      [
        {
          tabName: "setup",
          title: "Setup",
          description: "Interview name, length, etc.",
          icon: LinkIcon,
        },
        {
          tabName: "questions",
          title: "Questions",
          description: "Add, edit, and manage questions",
          icon: PenLineIcon,
        },
        {
          tabName: "respondents",
          title: "Respondents",
          description: "Invite respondents",
          icon: UsersIcon,
        },
      ].map((tab) => ({
        ...tab,
        selected: tab.tabName === (activeTab ?? "questions"),
      })),
    [activeTab]
  )

  const [showUrlDialog, setShowUrlDialog] = useState(false)

  const handlePublish = async () => {
    try {
      await publishSurvey({
        variables: {
          input: {
            id: survey.id
          }
        }
      })
      setShowUrlDialog(true)
    } catch (error) {
      console.error(error)
    }
  }

  const { isLoaded, isSignedIn, } = useAuth();
  const navigate = useNavigate();
  const clerk = useClerk()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      clerk.redirectToSignIn()
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (loading) return null;
  if (error) return <div>Error: {error.message}</div>;
  if (!survey) return <div>Survey not found</div>;

  const topBar = (
    <TooltipProvider delayDuration={200}>
      <div className="flex gap-2">
        <div className="flex-1 w-0 flex items-center">
          <div className="w-full flex flex-col gap-0.5">
            <h1 className="text-xl font-semibold text-zinc-900">
              {survey.title}
            </h1>
            <span className="flex items-center gap-2 text-left text-xs font-normal text-zinc-600">
              Last updated on {new Date(survey.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="self-center flex items-center gap-6">
          <div className="flex space-x-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setShowUrlDialog(true)}
                >
                  <LinkIcon size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Copy survey URL
              </TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-9 w-9">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontalIcon size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-2">
                <DropdownMenuItem>
                  <PenLineIcon className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArchiveIcon className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? "Publishing..." : "Publish changes"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Updates the published version of the survey
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      <SurveyUrlDialog
        surveyKey={survey.key}
        open={showUrlDialog}
        onOpenChange={setShowUrlDialog}
      />
    </TooltipProvider>
  )

  return (
    <div className="w-full px-6 flex flex-col">
      <SidebarInset >
        <header className="flex h-16 shrink-0 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Teams</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/${team?.slug}`}>{team?.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/${team?.slug}/${project?.id}`}>{project?.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/${team?.slug}/${project?.id}/surveys`}>Surveys</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{survey.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
      </SidebarInset >
      <div className="flex w-full h-full gap-12 pt-6 flex-col">
        {topBar}
        <Tabs
          className="flex-1 overflow-hidden flex flex-col"
          value={tabs.filter((s) => s.selected)[0]?.tabName ?? "questions"}
        >
          <TabsList className="font-medium text-sm self-start">
            {tabs.map((tab) => {
              return (
                <TabsTrigger
                  key={tab.tabName}
                  value={tab.tabName}
                  className="group"
                  onClick={() => {
                    setSearchParams({ t: tab.tabName });
                  }}
                >
                  <div className="flex gap-1.5 items-center">{tab.title}</div>
                </TabsTrigger>
              )
            })}
          </TabsList>
          <div className="h-0 w-full mb-4 mr-0" />
          <TabsContent
            value="setup"
            className="data-[state=active]:flex-1 data-[state=active]:overflow-auto mt-0"
          >
            <SurveySetup />
          </TabsContent>
          <TabsContent
            value="questions"
            className="h-full overflow-hidden data-[state=active]:flex-1 mt-0"
          >
            <SurveyForm />
          </TabsContent>
          <TabsContent
            value="respondents"
            className="flex flex-col gap-6 data-[state=active]:flex-1 data-[state=active]:overflow-auto mt-0"
          >
            <SurveyRespondents />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

