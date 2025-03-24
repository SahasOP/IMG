"use client"

import type React from "react"

import { type ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, ClipboardCheck, Users, Settings, LogOut, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

type NavItem = {
  title: string
  href: string
  icon: React.ReactNode
  roles: Array<"student" | "teacher" | "admin">
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["student", "teacher", "admin"],
  },
  {
    title: "My Internships",
    href: "/dashboard/internships",
    icon: <FileText className="h-5 w-5" />,
    roles: ["student"],
  },
  {
    title: "Pending Approvals",
    href: "/dashboard/approvals",
    icon: <ClipboardCheck className="h-5 w-5" />,
    roles: ["teacher", "admin"],
  },
  {
    title: "Manage Users",
    href: "/dashboard/users",
    icon: <Users className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
    roles: ["student", "teacher", "admin"],
  },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const filteredNavItems = navItems.filter(
    (item) => item.roles.includes(user.role) || (item.href === "/dashboard" && item.roles.includes(user.role)),
  )

  const NavLinks = () => (
    <>
      {filteredNavItems.map((item) => {
        const href = item.href === "/dashboard" ? `/dashboard/${user.role}` : item.href

        return (
          <Link
            key={item.href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              router.pathname === href && "bg-muted text-primary",
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        )
      })}
    </>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                  <div className="flex flex-col gap-4 py-4">
                    <div className="flex items-center justify-between">
                      <Link href="/" className="flex items-center gap-2 font-semibold">
                        Internship Marksheet
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-1">
                      <NavLinks />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            <Link href="/" className="flex items-center gap-2 font-semibold">
              Internship Marksheet
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <span className="text-sm font-medium">
                {user.name} ({user.role})
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <nav className="flex flex-col gap-2">
              <NavLinks />
            </nav>
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">{children}</main>
      </div>
    </div>
  )
}

