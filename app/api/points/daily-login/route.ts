import { getDb } from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { POINTS } from "@/lib/points"

export async function POST() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const db = await getDb()
    const user = await db.collection("users").findOne({ 
      email: session.user.email 
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Check if user already got points today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (user.lastLoginPoint && new Date(user.lastLoginPoint) >= today) {
      return NextResponse.json({ 
        message: "Already received points today",
        points: user.points 
      })
    }

    // Update points and last login
    await db.collection("users").updateOne(
      { email: session.user.email },
      { 
        $inc: { points: POINTS.DAILY_LOGIN },
        $set: { 
          lastLoginPoint: new Date(),
          lastActive: new Date()
        }
      }
    )

    return NextResponse.json({ 
      message: "Points added successfully",
      points: (user.points || 0) + POINTS.DAILY_LOGIN
    })
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
