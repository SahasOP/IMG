import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { withAuth } from "@/middleware/auth"
import { put } from "@vercel/blob"

async function handler(req: NextRequest) {
  // Handle POST request for creating a new internship
  if (req.method === "POST") {
    try {
      const userId = req.headers.get("userId")
      const userRole = req.headers.get("userRole")

      // Only students can submit internships
      if (userRole !== "student") {
        return NextResponse.json({ message: "Only students can submit internships" }, { status: 403 })
      }

      // Parse form data
      const formData = await req.formData()
      const companyName = formData.get("companyName") as string
      const role = formData.get("role") as string
      const startDate = formData.get("startDate") as string
      const endDate = formData.get("endDate") as string
      const duration = formData.get("duration") as string
      const description = formData.get("description") as string
      const certificate = formData.get("certificate") as File

      // Validate input
      if (!companyName || !role || !startDate || !endDate || !duration || !description || !certificate) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 })
      }

      // Upload certificate to Vercel Blob
      const blob = await put(certificate.name, certificate, {
        access: "public",
      })

      // Connect to database
      const db = await connectToDatabase()

      // Create internship record
      const result = await db.collection("internships").insertOne({
        studentId: userId,
        companyName,
        role,
        startDate,
        endDate,
        duration,
        description,
        certificateUrl: blob.url,
        status: "pending",
        createdAt: new Date(),
      })

      // Return success response
      return NextResponse.json(
        {
          message: "Internship submitted successfully",
          internshipId: result.insertedId,
        },
        { status: 201 },
      )
    } catch (error) {
      console.error("Internship submission error:", error)
      return NextResponse.json({ message: "Failed to submit internship" }, { status: 500 })
    }
  }

  // Handle GET request for fetching internships
  else if (req.method === "GET") {
    try {
      const userId = req.headers.get("userId")
      const userRole = req.headers.get("userRole")

      // Connect to database
      const db = await connectToDatabase()

      let query = {}

      // If student, only show their internships
      if (userRole === "student") {
        query = { studentId: userId }
      }
      // If teacher, show all pending internships for review
      else if (userRole === "teacher") {
        query = { status: "pending", teacherApproval: { $exists: false } }
      }
      // If admin, show all internships approved by teachers but not by admin
      else if (userRole === "admin") {
        query = {
          status: "pending",
          teacherApproval: { $exists: true },
          adminApproval: { $exists: false },
        }
      }

      // Fetch internships
      const internships = await db.collection("internships").find(query).sort({ createdAt: -1 }).toArray()

      // Return internships
      return NextResponse.json(internships)
    } catch (error) {
      console.error("Fetch internships error:", error)
      return NextResponse.json({ message: "Failed to fetch internships" }, { status: 500 })
    }
  }

  // Handle unsupported methods
  else {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
  }
}

export const GET = (req: NextRequest) => withAuth(handler)(req)
export const POST = (req: NextRequest) => withAuth(handler)(req)

