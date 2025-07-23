import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/app-sidebar"
import {cookies} from "next/headers"

export default async function Layout({children}: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
      <SidebarProvider
          defaultOpen={defaultOpen}
          style={{
            "--sidebar-width": "10rem",
            "--sidebar-width-mobile": "10rem",
          }}
      >
        <AppSidebar/>
        <main>
          <SidebarTrigger/>
          {children}
        </main>
      </SidebarProvider>
  )
}