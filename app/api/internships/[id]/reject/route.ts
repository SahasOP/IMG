import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"
import { withAuth } from "@/middleware/auth"

async function handler(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = req.headers.get("userId")
    const userRole = req.headers.get("userRole")

    // Only teachers and admins can reject internships
    if (userRole !== "teacher" && userRole !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Parse request body
    const { feedback } = await req.json()

    // Validate input
    if (!feedback) {
      return NextResponse.json({ message: "Feedback is required for rejection" }, { status: 400 })
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

    // Check if already approved by an admin
    if (internship.adminApproval) {
      return NextResponse.json(
        { message: "Cannot reject an internship that has been finally approved" },
        { status: 400 },
      )
    }

    // Update the internship
    const result = await db.collection("internships").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status: "rejected",
          rejectedBy: userId,
          rejectedAt: new Date(),
          rejectionFeedback: feedback,
        },
        // Remove any previous approvals if admin is rejecting
        ...(userRole === "admin" ? { $unset: { teacherApproval: "" } } : {}),
      },
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Failed to reject internship" }, { status: 500 })
    }

    // Return success response
    return NextResponse.json({
      message: "Internship rejected successfully",
    })
  } catch (error) {
    console.error("Reject internship error:", error)
    return NextResponse.json({ message: "Failed to reject internship" }, { status: 500 })
  }
}

export const POST = (req: NextRequest, context: { params: { id: string } }) => withAuth(handler)(req, context)

