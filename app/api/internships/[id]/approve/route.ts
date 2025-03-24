import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"
import { withAuth } from "@/middleware/auth"

async function handler(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = req.headers.get("userId")
    const userRole = req.headers.get("userRole")

    // Only teachers and admins can approve internships
    if (userRole !== "teacher" && userRole !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Parse request body
    const { credits, feedback } = await req.json()

    // Validate input
    if (userRole === "teacher" && (!credits || credits < 1)) {
      return NextResponse.json({ message: "Valid credits are required" }, { status: 400 })
    }

    // Connect to database
    const db = await connectToDatabase()

    // Get the internship
    const internship = await db.collection("internships").findOne({
      _id: new ObjectId(params.id),
    })

    if (!internship) {
      return NextResponse.json({ message: "Internship not found" }, { status: 404 })
    }

    // Update based on role
    let updateData = {}

    if (userRole === "teacher") {
      // Check if already approved by a teacher
      if (internship.teacherApproval) {
        return NextResponse.json({ message: "Internship already approved by a teacher" }, { status: 400 })
      }

      updateData = {
        $set: {
          teacherApproval: {
            approvedBy: userId,
            approvedAt: new Date(),
            feedback: feedback || "",
            credits: credits,
          },
          credits: credits,
          status: "pending", // Still pending admin approval
        },
      }
    } else if (userRole === "admin") {
      // Check if approved by a teacher first
      if (!internship.teacherApproval) {
        return NextResponse.json({ message: "Internship must be approved by a teacher first" }, { status: 400 })
      }

      // Check if already approved by an admin
      if (internship.adminApproval) {
        return NextResponse.json({ message: "Internship already approved by an admin" }, { status: 400 })
      }

      updateData = {
        $set: {
          adminApproval: {
            approvedBy: userId,
            approvedAt: new Date(),
            feedback: feedback || "",
          },
          status: "approved", // Final approval
        },
      }
    }

    // Update the internship
    const result = await db.collection("internships").updateOne({ _id: new ObjectId(params.id) }, updateData)

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Failed to approve internship" }, { status: 500 })
    }

    // Return success response
    return NextResponse.json({
      message: `Internship ${userRole === "admin" ? "finally " : ""}approved successfully`,
    })
  } catch (error) {
    console.error("Approve internship error:", error)
    return NextResponse.json({ message: "Failed to approve internship" }, { status: 500 })
  }
}

export const POST = (req: NextRequest, context: { params: { id: string } }) => withAuth(handler)(req, context)

