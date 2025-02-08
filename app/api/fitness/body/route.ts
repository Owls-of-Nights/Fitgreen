import { getDb } from "@/lib/mongodb"
// ...import any other necessary modules...
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { POINTS } from "@/lib/points"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { weight, height, age, gender } = await request.json()
    const db = await getDb()

    // Update body metrics (age, weight, height, gender)
    await db.collection("fitness_metrics").updateOne(
      { userEmail: session.user.email },
      {
        $set: {
          userEmail: session.user.email,
          ...(weight !== undefined && { weight }),
          ...(height !== undefined && { height }),
          ...(age !== undefined && { age }),
          ...(gender !== undefined && { gender }),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    // Optionally add points for first-time body metrics entry
    const existing = await db.collection("fitness_metrics").findOne({ userEmail: session.user.email })
    let pointsToAdd = 0
    if (!existing && (weight || height || age)) {
      pointsToAdd += POINTS.FITNESS_DATA_ENTRY
      await db.collection("users").updateOne(
        { email: session.user.email },
        {
          $inc: { points: pointsToAdd },
          $set: { lastActive: new Date() }
        }
      )
    }

    const updatedMetrics = await db.collection("fitness_metrics").findOne({ userEmail: session.user.email })

    return NextResponse.json({ success: true, metrics: updatedMetrics })
  } catch (error) {
    console.error("Body metrics update error:", error)
    return NextResponse.json({ error: "Failed to update body metrics" }, { status: 500 })
  }
}

// Optionally add GET to fetch body metrics if needed:
// export async function GET() { ... }
