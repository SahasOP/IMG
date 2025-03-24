"use client"

import { useAuth } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function TeacherDashboard() {
  const { user } = useAuth()

  // This would be fetched from the API in a real application
  const stats = {
    totalReviewed: 24,
    pendingReview: 5,
    approved: 18,
    rejected: 6,
  }

  // Recent submissions would be fetched from the API
  const recentSubmissions = [
    {
      id: "1",
      student: "John Smith",
      company: "Tech Solutions Inc.",
      role: "Frontend Developer",
      status: "Pending",
      submittedAt: "2023-07-15",
    },
    {
      id: "2",
      student: "Emily Johnson",
      company: "Data Systems Ltd.",
      role: "Data Analyst",
      status: "Pending",
      submittedAt: "2023-07-14",
    },
    {
      id: "3",
      student: "Michael Brown",
      company: "Cloud Innovations",
      role: "Cloud Engineer",
      status: "Pending",
      submittedAt: "2023-07-12",
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviewed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviewed}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Recent internship submissions awaiting your review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <div className="font-medium">{submission.student}</div>
                  <div className="text-sm">
                    {submission.company} - {submission.role}
                  </div>
                  <div className="text-xs text-muted-foreground">Submitted on {submission.submittedAt}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/approvals/${submission.id}`}>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/dashboard/approvals">
              <Button variant="outline">View All Pending Approvals</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

