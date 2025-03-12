import { ApplicationLayout } from "@/components/core/application-layout"
import { type LoaderFunctionArgs } from "@remix-run/node"
import { Outlet } from "@remix-run/react"

export function clientLoader({ params }: LoaderFunctionArgs) {
  const { project } = params
  return {
    project
  }
}

export default function ProjectLayout() {
  return (
    <ApplicationLayout>
      <Outlet />
    </ApplicationLayout>
  )
}