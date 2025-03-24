import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export function withAuth(handler: Function, allowedRoles?: string[]) {
  return async (req: NextRequest) => {
    try {
      // Get token from header
      const authHeader = req.headers.get("authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      }

      const token = authHeader.split(" ")[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string; role: string }

      // Check role if allowedRoles is provided
      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 })
      }

      // Add user to request
      req.headers.set("userId", decoded.userId)
      req.headers.set("userRole", decoded.role)

      // Call the original handler
      return handler(req)
    } catch (error) {
      console.error("Auth middleware error:", error)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
  }
}

