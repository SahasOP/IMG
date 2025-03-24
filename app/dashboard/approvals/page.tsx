"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function ApprovalsList() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // This would be fetched from the API in a real application
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: "1",
      student: "John Smith",
      companyName: "Tech Solutions Inc.",
      role: "Frontend Developer",
      duration: "12 weeks",
      submittedAt: "2023-07-15",
    },
    {
      id: "2",
      student: "Emily Johnson",
      companyName: "Data Systems Ltd.",
      role: "Data Analyst",
      duration: "8 weeks",
      submittedAt: "2023-07-14",
    },
    {
      id: "3",
      student: "Michael Brown",
      companyName: "Cloud Innovations",
      role: "Cloud Engineer",
      duration: "16 weeks",
      submittedAt: "2023-07-12",
    },
  ])

  const [approvedInternships, setApprovedInternships] = useState([
    {
      id: "4",
      student: "Sarah Wilson",
      companyName: "Digital Marketing Co.",
      role: "Marketing Intern",
      duration: "8 weeks",
      approvedAt: "2023-07-05",
      credits: 2,
    },
    {
      id: "5",
      student: "David Lee",
      companyName: "Financial Services Inc.",
      role: "Financial Analyst",
      duration: "12 weeks",
      approvedAt: "2023-07-03",
      credits: 3,
    },
  ])

  const [rejectedInternships, setRejectedInternships] = useState([
    {
      id: "6",
      student: "Jessica Taylor",
      companyName: "Web Design Studio",
      role: "UI/UX Designer",
      duration: "4 weeks",
      rejectedAt: "2023-07-08",
      reason: "Duration too short for credit requirements",
    },
  ])

  useEffect(() => {
    // Simulate API call to fetch approvals
    const fetchApprovals = async () => {
      try {
        // In a real application, you would fetch the approvals from your API
        // const response = await fetch("/api/approvals")
        // if (!response.ok) {
        //   throw new Error("Failed to fetch approvals")
        // }
        // const data = await response.json()
        // setPendingApprovals(data.pending)
        // setApprovedInternships(data.approved)
        // setRejectedInternships(data.rejected)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Failed to fetch approvals")
        setLoading(false)
      }
    }

    fetchApprovals()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Internship Approvals</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending ({pendingApprovals.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedInternships.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedInternships.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Internships waiting for your review</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No pending approvals at this time.</div>
              ) : (
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div
                      key={approval.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-medium">{approval.student}</div>
                        <div className="text-sm">
                          {approval.companyName} - {approval.role}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {approval.duration} • Submitted on {approval.submittedAt}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/approvals/${approval.id}`}>
                          <Button size="sm">Review</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Internships</CardTitle>
              <CardDescription>Internships you have approved</CardDescription>
            </CardHeader>
            <CardContent>
              {approvedInternships.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No approved internships yet.</div>
              ) : (
                <div className="space-y-4">
                  {approvedInternships.map((internship) => (
                    <div
                      key={internship.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-medium">{internship.student}</div>
                        <div className="text-sm">
                          {internship.companyName} - {internship.role}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {internship.duration} • Approved on {internship.approvedAt}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-green-500">{internship.credits} Credits</Badge>
                        <Link href={`/dashboard/approvals/${internship.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Internships</CardTitle>
              <CardDescription>Internships you have rejected</CardDescription>
            </CardHeader>
            <CardContent>
              {rejectedInternships.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No rejected internships yet.</div>
              ) : (
                <div className="space-y-4">
                  {rejectedInternships.map((internship) => (
                    <div
                      key={internship.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-medium">{internship.student}</div>
                        <div className="text-sm">
                          {internship.companyName} - {internship.role}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {internship.duration} • Rejected on {internship.rejectedAt}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/approvals/${internship.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

