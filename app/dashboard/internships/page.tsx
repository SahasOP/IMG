"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function InternshipsList() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // This would be fetched from the API in a real application
  const [internships, setInternships] = useState([
    {
      id: "1",
      companyName: "Tech Solutions Inc.",
      role: "Frontend Developer",
      duration: "12 weeks",
      status: "approved",
      credits: 3,
      submittedAt: "2023-05-15",
    },
    {
      id: "2",
      companyName: "Data Systems Ltd.",
      role: "Data Analyst",
      duration: "8 weeks",
      status: "approved",
      credits: 3,
      submittedAt: "2023-06-20",
    },
    {
      id: "3",
      companyName: "Cloud Innovations",
      role: "Cloud Engineer",
      duration: "16 weeks",
      status: "pending",
      credits: 0,
      submittedAt: "2023-07-10",
    },
  ])

  useEffect(() => {
    // Simulate API call to fetch internships
    const fetchInternships = async () => {
      try {
        // In a real application, you would fetch the internships from your API
        // const response = await fetch("/api/internships")
        // if (!response.ok) {
        //   throw new Error("Failed to fetch internships")
        // }
        // const data = await response.json()
        // setInternships(data)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Failed to fetch internships")
        setLoading(false)
      }
    }

    fetchInternships()
  }, [])

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
        <h1 className="text-2xl font-bold">My Internships</h1>
        <Link href="/dashboard/internships/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Internship
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {internships.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-center text-muted-foreground mb-4">You haven't submitted any internships yet.</p>
            <Link href="/dashboard/internships/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Internship
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Internships</CardTitle>
            <CardDescription>View and manage all your internship submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {internships.map((internship) => (
                <div
                  key={internship.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <div className="font-medium">{internship.companyName}</div>
                    <div className="text-sm text-muted-foreground">{internship.role}</div>
                    <div className="text-xs text-muted-foreground">
                      {internship.duration} • Submitted on {internship.submittedAt}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(internship.status)}
                      {internship.credits > 0 && (
                        <span className="text-xs text-muted-foreground">{internship.credits} credits</span>
                      )}
                    </div>
                    <Link href={`/dashboard/internships/${internship.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}

