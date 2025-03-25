import { Project } from "@/backend.types";
import { ProjectActions } from "./project-actions";
import { formatDistanceToNow } from "date-fns";

export function ProjectList({ projects, teamSlug }: { projects: Project[], teamSlug: string }) {
  return (
    <div className="mx-auto w-full">
      <div className="flex flex-col gap-3">
        {projects.map((project) => (
          <div key={project.id} className="w-full">
            <li className="list-none">
              <a href={`/${teamSlug}/${project.id}`}>
                <div className="group rounded-md p-2 hover:bg-zinc-100">
                  <div className="flex flex-row gap-2">
                    <div className="flex flex-col gap-1 grow justify-center overflow-hidden">
                      <div className="flex flex-nowrap gap-2 justify-between">
                        <p className="text-sm font-medium text-zinc-900">{project.name}</p>
                      </div>
                      <div className="flex font-normal text-zinc-600">
                        <span className="text-xs">
                          Last edited {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="relative z-20">
                      <ProjectActions project={project} />
                    </div>
                  </div>
                </div>
              </a>
            </li>
          </div>
        ))}
      </div>
    </div>
  );
} 
