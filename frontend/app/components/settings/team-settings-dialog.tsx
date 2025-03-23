import * as React from "react"
import {
  Users,
  Settings2,
  Building2,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { MembersSettings } from "./members-settings"
import { GeneralSettings } from "./general-settings"
import { Team } from "@/backend.types"

const TABS = [
  { name: "General", icon: Building2, component: GeneralSettings },
  { name: "Members", icon: Users, component: MembersSettings },
] as const

interface TeamSettingsDialogProps {
  team: Team;
}

export function TeamSettingsDialog({ team }: TeamSettingsDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<typeof TABS[number]["name"]>(TABS[0].name)

  const ActiveComponent = TABS.find(tab => tab.name === activeTab)?.component

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <Settings2 className="h-4 w-4" />
          <span>Settings</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 md:max-h-[600px] md:max-w-[800px]">
        <DialogTitle className="sr-only">Team Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Manage your team settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden w-[200px] md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {TABS.map((tab) => (
                      <SidebarMenuItem key={tab.name}>
                        <SidebarMenuButton
                          onClick={() => setActiveTab(tab.name)}
                          isActive={tab.name === activeTab}
                        >
                          <tab.icon className="h-4 w-4" />
                          <span>{tab.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[580px] flex-1 flex-col overflow-hidden">
            <div className="flex flex-1 flex-col overflow-y-auto p-6">
              {ActiveComponent && <ActiveComponent team={team} />}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
} 