import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"
import { generateMarksheetPDF } from "@/lib/generate-marksheet"
import { withAuth } from "@/middleware/auth"

async function handler(req: NextRequest) {
  try {
    const userId = req.headers.get("userId")
    const userRole = req.headers.get("userRole")

    // Get student ID from query params or use the logged-in user's ID
    const url = new URL(req.url)
    let studentId = url.searchParams.get("studentId")

    // If admin or teacher is requesting a specific student's marksheet
    if ((userRole === "admin" || userRole === "teacher") && studentId) {
      // Allow them to access it
    } else {
      // For students, they can only access their own marksheet
      if (userRole === "student") {
        studentId = userId
      } else {
        return NextResponse.json({ message: "Unauthorized access" }, { status: 403 })
      }
    }

    // Connect to database
    const db = await connectToDatabase()

    // Get student information
    const student = await db.collection("users").findOne({
      _id: new ObjectId(studentId),
      role: "student",
    })

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 })
    }

    // Get approved internships for the student
    const internships = await db
      .collection("internships")
      .find({
        studentId: studentId,
        status: "approved",
        adminApproval: { $exists: true },
      })
      .toArray()

    if (internships.length === 0) {
      return NextResponse.json({ message: "No approved internships found" }, { status: 404 })
    }

    // Format internships for marksheet
    const formattedInternships = await Promise.all(
      internships.map(async (internship) => {
        // Get teacher name
        const teacher = await db.collection("users").findOne({
          _id: new ObjectId(internship.teacherApproval.approvedBy),
        })

        // Get admin name
        const admin = await db.collection("users").findOne({
          _id: new ObjectId(internship.adminApproval.approvedBy),
        })

        return {
          companyName: internship.companyName,
          role: internship.role,
          duration: `${internship.duration} weeks`,
          startDate: internship.startDate,
          endDate: internship.endDate,
          credits: internship.credits,
          teacherName: teacher ? teacher.name : "Unknown Teacher",
          adminName: admin ? admin.name : "Unknown Admin",
        }
      }),
    )

    // Calculate total credits
    const totalCredits = formattedInternships.reduce((sum, internship) => sum + internship.credits, 0)

    // Generate PDF
    const doc = await generateMarksheetPDF(
      {
        name: student.name,
        email: student.email,
        id: student._id.toString(),
      },
      formattedInternships,
      totalCredits,
    )

    // Convert to buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"))

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="marksheet_${student.name.replace(/\s+/g, "_")}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Marksheet generation error:", error)
    return NextResponse.json({ message: "Failed to generate marksheet" }, { status: 500 })
  }
}

export const GET = (req: NextRequest) => withAuth(handler)(req)

