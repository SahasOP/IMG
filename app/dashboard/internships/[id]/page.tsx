"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Download, FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function InternshipDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // This would be fetched from the API in a real application
  const [internship, setInternship] = useState({
    id: params.id,
    companyName: "Tech Solutions Inc.",
    role: "Frontend Developer",
    startDate: "2023-05-01",
    endDate: "2023-07-31",
    duration: "12",
    description:
      "During my internship at Tech Solutions Inc., I worked on developing user interfaces using React and TypeScript. I collaborated with the design team to implement responsive designs and worked with the backend team to integrate APIs. I also participated in code reviews and learned about CI/CD pipelines.",
    certificateUrl: "/placeholder.svg?height=300&width=400",
    status: "approved",
    credits: 3,
    submittedAt: "2023-08-01",
    teacherApproval: {
      approvedBy: "Dr. Williams",
      approvedAt: "2023-08-05",
      feedback: "Excellent work! The internship aligns well with your academic goals.",
    },
    adminApproval: {
      approvedBy: "Admin User",
      approvedAt: "2023-08-07",
      feedback: "Approved for final marksheet.",
    },
  })

  useEffect(() => {
    // Simulate API call to fetch internship details
    const fetchInternship = async () => {
      try {
        // In a real application, you would fetch the internship details from your API
        // const response = await fetch(`/api/internships/${params.id}`)
        // if (!response.ok) {
        //   throw new Error("Failed to fetch internship details")
        // }
        // const data = await response.json()
        // setInternship(data)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Failed to fetch internship details")
        setLoading(false)
      }
    }

    fetchInternship()
  }, [params.id])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return (
          <Badge variant="outline" className="bg-yellow-500 text-white">
            Pending
          </Badge>
        )
    }
  }

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
        <h1 className="text-2xl font-bold">Internship Details</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/internships")}>
          Back to Internships
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{internship.companyName}</CardTitle>
              <CardDescription>{internship.role}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(internship.status)}
              {internship.status === "approved" && (
                <Badge variant="outline" className="bg-blue-500 text-white">
                  {internship.credits} Credits
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                <p className="font-medium">{internship.startDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                <p className="font-medium">{internship.endDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                <p className="font-medium">{internship.duration} weeks</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="text-sm mt-1">{internship.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Certificate</h3>
              <div className="mt-2 flex items-center gap-4">
                <img
                  src={internship.certificateUrl || "/placeholder.svg"}
                  alt="Certificate"
                  className="h-40 w-auto border rounded-md object-cover"
                />
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download Certificate
                </Button>
              </div>
            </div>

            {internship.teacherApproval && (
              <div className="border rounded-md p-4 bg-muted/50">
                <h3 className="text-sm font-medium">Teacher Approval</h3>
                <div className="mt-1 text-sm">
                  <p>
                    Approved by {internship.teacherApproval.approvedBy} on {internship.teacherApproval.approvedAt}
                  </p>
                  <p className="mt-1">{internship.teacherApproval.feedback}</p>
                </div>
              </div>
            )}

            {internship.adminApproval && (
              <div className="border rounded-md p-4 bg-muted/50">
                <h3 className="text-sm font-medium">Admin Approval</h3>
                <div className="mt-1 text-sm">
                  <p>
                    Approved by {internship.adminApproval.approvedBy} on {internship.adminApproval.approvedAt}
                  </p>
                  <p className="mt-1">{internship.adminApproval.feedback}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {internship.status === "approved" && internship.adminApproval && (
          <Card>
            <CardHeader>
              <CardTitle>Marksheet Entry</CardTitle>
              <CardDescription>This internship has been added to your marksheet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    You can download your complete marksheet from the dashboard.
                  </p>
                </div>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Download Marksheet
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

