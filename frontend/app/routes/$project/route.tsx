import { ApplicationLayout } from "@/components/core/application-layout"
import { type LoaderFunctionArgs } from "@remix-run/node"
import { Outlet } from "@remix-run/react"
import { SignedIn } from "@clerk/remix"

export function clientLoader({ params }: LoaderFunctionArgs) {
  const { project } = params
  return {
    project
  }
}

export default function ProjectLayout() {
  return (
    <SignedIn>
      <ApplicationLayout>
        <Outlet />
      </ApplicationLayout>
    </SignedIn>
  )
}