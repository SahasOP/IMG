"use client"

import { useAuth } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Award, Download } from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  const { user } = useAuth()

  // This would be fetched from the API in a real application
  const stats = {
    totalInternships: 3,
    pendingApproval: 1,
    approved: 2,
    rejected: 0,
    totalCredits: 6,
  }

  // Recent internships would be fetched from the API
  const recentInternships = [
    {
      id: "1",
      company: "Tech Solutions Inc.",
      role: "Frontend Developer",
      status: "Approved",
      credits: 3,
      submittedAt: "2023-05-15",
    },
    {
      id: "2",
      company: "Data Systems Ltd.",
      role: "Data Analyst",
      status: "Approved",
      credits: 3,
      submittedAt: "2023-06-20",
    },
    {
      id: "3",
      company: "Cloud Innovations",
      role: "Cloud Engineer",
      status: "Pending",
      credits: 0,
      submittedAt: "2023-07-10",
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <Link href="/dashboard/internships/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Internship
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Internships</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInternships}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApproval}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCredits}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent Internships</CardTitle>
          <CardDescription>Overview of your recent internship submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInternships.map((internship) => (
              <div
                key={internship.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <div className="font-medium">{internship.company}</div>
                  <div className="text-sm text-muted-foreground">{internship.role}</div>
                  <div className="text-xs text-muted-foreground">Submitted on {internship.submittedAt}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${
                        internship.status === "Approved"
                          ? "text-green-500"
                          : internship.status === "Rejected"
                            ? "text-red-500"
                            : "text-yellow-500"
                      }`}
                    >
                      {internship.status}
                    </div>
                    {internship.credits > 0 && (
                      <div className="text-xs text-muted-foreground">{internship.credits} credits</div>
                    )}
                  </div>
                  <Link href={`/dashboard/internships/${internship.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Marksheet</CardTitle>
          <CardDescription>Download your internship marksheet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Your marksheet contains all approved internships and their assigned credits.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/marksheet">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View Marksheet
                </Button>
              </Link>
              <Button onClick={() => window.open("/api/marksheet", "_blank")}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

