"use client"

import { useAuth } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { user } = useAuth()

  // This would be fetched from the API in a real application
  const stats = {
    totalStudents: 120,
    totalTeachers: 15,
    pendingFinalApproval: 8,
    totalInternships: 245,
  }

  // Recent submissions would be fetched from the API
  const pendingFinalApprovals = [
    {
      id: "1",
      student: "John Smith",
      company: "Tech Solutions Inc.",
      role: "Frontend Developer",
      teacherApproved: "Dr. Williams",
      submittedAt: "2023-07-10",
    },
    {
      id: "2",
      student: "Emily Johnson",
      company: "Data Systems Ltd.",
      role: "Data Analyst",
      teacherApproved: "Prof. Garcia",
      submittedAt: "2023-07-08",
    },
    {
      id: "3",
      student: "Michael Brown",
      company: "Cloud Innovations",
      role: "Cloud Engineer",
      teacherApproved: "Dr. Chen",
      submittedAt: "2023-07-05",
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Final Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingFinalApproval}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Internships</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInternships}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Final Approvals</CardTitle>
            <CardDescription>Internships approved by teachers awaiting your final approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingFinalApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <div className="font-medium">{approval.student}</div>
                    <div className="text-sm">
                      {approval.company} - {approval.role}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Approved by {approval.teacherApproved} on {approval.submittedAt}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/approvals/${approval.id}`}>
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

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage students and teachers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Students</div>
                    <div className="text-sm text-muted-foreground">Manage student accounts</div>
                  </div>
                  <Link href="/dashboard/users?role=student">
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Teachers</div>
                    <div className="text-sm text-muted-foreground">Manage teacher accounts</div>
                  </div>
                  <Link href="/dashboard/users?role=teacher">
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Link href="/dashboard/users/new">
                  <Button className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Add New User
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

