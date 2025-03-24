"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Download } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MarksheetPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // This would be fetched from the API in a real application
  const [marksheetData, setMarksheetData] = useState({
    student: {
      name: "John Smith",
      id: "STU123456",
      email: "john@example.com",
    },
    totalCredits: 9,
    internships: [
      {
        id: "1",
        companyName: "Tech Solutions Inc.",
        role: "Frontend Developer",
        duration: "12 weeks",
        period: "May 1, 2023 - Jul 31, 2023",
        credits: 3,
        approvedBy: "Dr. Williams, Admin User",
      },
      {
        id: "2",
        companyName: "Data Systems Ltd.",
        role: "Data Analyst",
        duration: "8 weeks",
        period: "Aug 15, 2023 - Oct 10, 2023",
        credits: 3,
        approvedBy: "Prof. Garcia, Admin User",
      },
      {
        id: "3",
        companyName: "Cloud Innovations",
        role: "Cloud Engineer",
        duration: "16 weeks",
        period: "Nov 1, 2023 - Feb 20, 2024",
        credits: 3,
        approvedBy: "Dr. Chen, Admin User",
      },
    ],
  })

  useEffect(() => {
    // Simulate API call to fetch marksheet data
    const fetchMarksheetData = async () => {
      try {
        // In a real application, you would fetch the marksheet data from your API
        // const response = await fetch("/api/marksheet/data")
        // if (!response.ok) {
        //   throw new Error("Failed to fetch marksheet data")
        // }
        // const data = await response.json()
        // setMarksheetData(data)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Failed to fetch marksheet data")
        setLoading(false)
      }
    }

    fetchMarksheetData()
  }, [])

  const handleDownloadPDF = () => {
    // In a real application, this would trigger the download from the API
    window.open("/api/marksheet", "_blank")
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
        <h1 className="text-2xl font-bold">Internship Marksheet</h1>
        <Button onClick={handleDownloadPDF}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="font-medium">{marksheetData.student.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Student ID</h3>
              <p className="font-medium">{marksheetData.student.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="font-medium">{marksheetData.student.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Internship Details</CardTitle>
          <CardDescription>List of approved internships and credits</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Approved By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marksheetData.internships.map((internship) => (
                <TableRow key={internship.id}>
                  <TableCell className="font-medium">{internship.companyName}</TableCell>
                  <TableCell>{internship.role}</TableCell>
                  <TableCell>{internship.duration}</TableCell>
                  <TableCell>{internship.period}</TableCell>
                  <TableCell>{internship.credits}</TableCell>
                  <TableCell>{internship.approvedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Total Credits Earned</h3>
              <p className="text-sm text-muted-foreground">Sum of all approved internship credits</p>
            </div>
            <Badge className="text-lg px-3 py-1 bg-green-500">{marksheetData.totalCredits} Credits</Badge>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

