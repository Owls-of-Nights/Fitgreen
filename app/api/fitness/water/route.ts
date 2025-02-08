import { getDb } from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { POINTS } from "@/lib/points"

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log("Raw water endpoint body:", body); // Debug log
    const { waterIntake } = body;
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const db = await getDb()

    // Update water intake
    await db.collection("fitness_metrics").updateOne(
      { userEmail: session.user.email },
      {
        $set: {
          userEmail: session.user.email,
          waterIntake,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    let pointsToAdd = 0
    // Award water goal points if reached and not already awarded today
    if (waterIntake >= 2000) {
      const lastWaterPoints = await db.collection("users").findOne(
        { email: session.user.email },
        { projection: { lastWaterPoints: 1 } }
      )
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (!lastWaterPoints?.lastWaterPoints || new Date(lastWaterPoints.lastWaterPoints) < today) {
        pointsToAdd += POINTS.WATER_GOAL_COMPLETION
        await db.collection("users").updateOne(
          { email: session.user.email },
          {
            $inc: { points: pointsToAdd },
            $set: { 
              lastActive: new Date(),
              lastWaterPoints: new Date()
            }
          }
        )
      }
    }

    const updatedMetrics = await db.collection("fitness_metrics").findOne({ userEmail: session.user.email })

    return NextResponse.json({ success: true, pointsEarned: pointsToAdd, metrics: updatedMetrics })
  } catch (error) {
    console.error("Water intake update error:", error)
    return NextResponse.json({ error: "Failed to update water intake" }, { status: 500 })
  }
}

// Optionally add GET to fetch water intake if needed:
// export async function GET() { ... }
