import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    // Get token from header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string }

    // Connect to database
    const db = await connectToDatabase()
    const usersCollection = db.collection("users")

    // Find user
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) })
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Return user data
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
}

