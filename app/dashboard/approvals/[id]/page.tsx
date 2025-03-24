"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Download, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function InternshipApproval({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [credits, setCredits] = useState("3")
  const [feedback, setFeedback] = useState("")

  // This would be fetched from the API in a real application
  const [internship, setInternship] = useState({
    id: params.id,
    student: {
      id: "123",
      name: "John Smith",
      email: "john@example.com",
    },
    companyName: "Tech Solutions Inc.",
    role: "Frontend Developer",
    startDate: "2023-05-01",
    endDate: "2023-07-31",
    duration: "12",
    description:
      "During my internship at Tech Solutions Inc., I worked on developing user interfaces using React and TypeScript. I collaborated with the design team to implement responsive designs and worked with the backend team to integrate APIs. I also participated in code reviews and learned about CI/CD pipelines.",
    certificateUrl: "/placeholder.svg?height=300&width=400",
    status: "pending",
    submittedAt: "2023-08-01",
    teacherApproval: null,
    adminApproval: null,
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

  const handleApprove = async () => {
    setActionLoading(true)
    try {
      // In a real application, you would submit the approval to your API
      // const response = await fetch(`/api/internships/${params.id}/approve`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     credits: parseInt(credits),
      //     feedback,
      //     role: user.role
      //   }),
      // })
      // if (!response.ok) {
      //   throw new Error("Failed to approve internship")
      // }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      router.push("/dashboard/approvals")
    } catch (err: any) {
      setError(err.message || "Failed to approve internship")
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    setActionLoading(true)
    try {
      // In a real application, you would submit the rejection to your API
      // const response = await fetch(`/api/internships/${params.id}/reject`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     feedback,
      //     role: user.role
      //   }),
      // })
      // if (!response.ok) {
      //   throw new Error("Failed to reject internship")
      // }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      router.push("/dashboard/approvals")
    } catch (err: any) {
      setError(err.message || "Failed to reject internship")
    } finally {
      setActionLoading(false)
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
        <h1 className="text-2xl font-bold">Internship Review</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/approvals")}>
          Back to Approvals
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Internship Details</CardTitle>
              <CardDescription>
                Submitted by {internship.student.name} on {internship.submittedAt}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
                  <p className="font-medium">{internship.companyName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                  <p className="font-medium">{internship.role}</p>
                </div>
              </div>
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
                <p className="text-sm">{internship.description}</p>
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
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Review Decision</CardTitle>
              <CardDescription>
                {user?.role === "teacher"
                  ? "Approve or reject this internship submission"
                  : "Give final approval for this internship"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.role === "teacher" && (
                <div className="space-y-2">
                  <Label htmlFor="credits">Assign Credits</Label>
                  <Select value={credits} onValueChange={setCredits}>
                    <SelectTrigger id="credits">
                      <SelectValue placeholder="Select credits" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Credit</SelectItem>
                      <SelectItem value="2">2 Credits</SelectItem>
                      <SelectItem value="3">3 Credits</SelectItem>
                      <SelectItem value="4">4 Credits</SelectItem>
                      <SelectItem value="5">5 Credits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide feedback to the student"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" onClick={handleApprove} disabled={actionLoading}>
                <CheckCircle className="mr-2 h-4 w-4" />
                {user?.role === "teacher" ? "Approve & Assign Credits" : "Give Final Approval"}
              </Button>
              <Button variant="destructive" className="w-full" onClick={handleReject} disabled={actionLoading}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject Submission
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

