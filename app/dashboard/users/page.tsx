"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Plus, Search } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function UsersList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const roleParam = searchParams.get("role")
  const defaultTab = roleParam === "teacher" ? "teachers" : "students"

  // This would be fetched from the API in a real application
  const [students, setStudents] = useState([
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      createdAt: "2023-01-15",
      internships: 3,
    },
    {
      id: "2",
      name: "Emily Johnson",
      email: "emily@example.com",
      createdAt: "2023-02-20",
      internships: 2,
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael@example.com",
      createdAt: "2023-03-10",
      internships: 1,
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      createdAt: "2023-04-05",
      internships: 2,
    },
    {
      id: "5",
      name: "David Lee",
      email: "david@example.com",
      createdAt: "2023-05-12",
      internships: 0,
    },
  ])

  const [teachers, setTeachers] = useState([
    {
      id: "1",
      name: "Dr. Williams",
      email: "williams@example.com",
      createdAt: "2023-01-10",
      department: "Computer Science",
    },
    {
      id: "2",
      name: "Prof. Garcia",
      email: "garcia@example.com",
      createdAt: "2023-02-15",
      department: "Information Technology",
    },
    {
      id: "3",
      name: "Dr. Chen",
      email: "chen@example.com",
      createdAt: "2023-03-20",
      department: "Data Science",
    },
  ])

  useEffect(() => {
    // Simulate API call to fetch users
    const fetchUsers = async () => {
      try {
        // In a real application, you would fetch the users from your API
        // const response = await fetch("/api/users")
        // if (!response.ok) {
        //   throw new Error("Failed to fetch users")
        // }
        // const data = await response.json()
        // setStudents(data.students)
        // setTeachers(data.teachers)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Failed to fetch users")
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        <h1 className="text-2xl font-bold">User Management</h1>
        <Link href="/dashboard/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
          <TabsTrigger value="teachers">Teachers ({teachers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>Manage student accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredStudents.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {searchTerm ? "No students match your search." : "No students found."}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                        <div className="text-xs text-muted-foreground">Joined on {student.createdAt}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          {student.internships} Internship{student.internships !== 1 ? "s" : ""}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/users/${student.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers">
          <Card>
            <CardHeader>
              <CardTitle>Teachers</CardTitle>
              <CardDescription>Manage teacher accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTeachers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {searchTerm ? "No teachers match your search." : "No teachers found."}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTeachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-medium">{teacher.name}</div>
                        <div className="text-sm text-muted-foreground">{teacher.email}</div>
                        <div className="text-xs text-muted-foreground">
                          {teacher.department} • Joined on {teacher.createdAt}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/users/${teacher.id}`)}
                        >
                          View
                        </Button>
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

