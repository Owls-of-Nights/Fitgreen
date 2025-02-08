import { getDb } from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { POINTS } from "@/lib/points"

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()
    const metrics = await db.collection("fitness_metrics").findOne({
      userEmail: session.user.email
    })

    return NextResponse.json(metrics || {
      weight: 0,
      height: 0,
      age: 0,
      gender: '',
      waterIntake: 0,
      targetWaterIntake: 2000,
      sleepHours: 0,
      targetSleepHours: 8,
    })
  } catch (error) {
    console.error('GET metrics error:', error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log('Received metrics update:', body)

    const { weight, height, age, gender, waterIntake } = body

    const db = await getDb()
    
    // Get existing metrics
    const existingMetrics = await db.collection("fitness_metrics").findOne({
      userEmail: session.user.email
    })

    // Calculate points
    let pointsToAdd = 0

    // Points for first time metrics entry
    if (!existingMetrics && (weight || height)) {
      pointsToAdd += POINTS.FITNESS_DATA_ENTRY
    }

    // Points for water intake goal (even if already reached 2000ml)
    if (waterIntake >= 2000 && (!existingMetrics?.waterIntake || existingMetrics.waterIntake < 2000)) {
      const lastWaterPoints = await db.collection("users").findOne(
        { email: session.user.email },
        { projection: { lastWaterPoints: 1 } }
      )

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (!lastWaterPoints?.lastWaterPoints || new Date(lastWaterPoints.lastWaterPoints) < today) {
        pointsToAdd += POINTS.WATER_GOAL_COMPLETION
      }
    }

    // Update metrics
    await db.collection("fitness_metrics").updateOne(
      { userEmail: session.user.email },
      {
        $set: {
          userEmail: session.user.email,
          ...(weight !== undefined && { weight }),
          ...(height !== undefined && { height }),
          ...(age !== undefined && { age }),
          ...(gender !== undefined && { gender }),
          ...(waterIntake !== undefined && { waterIntake }),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    // Update user points
    if (pointsToAdd > 0) {
      await db.collection("users").updateOne(
        { email: session.user.email },
        { 
          $inc: { points: pointsToAdd },
          $set: { 
            lastActive: new Date(),
            ...(pointsToAdd === POINTS.WATER_GOAL_COMPLETION && {
              lastWaterPoints: new Date()
            })
          }
        }
      )
    }

    // Get updated metrics
    const updatedMetrics = await db.collection("fitness_metrics").findOne({
      userEmail: session.user.email
    })

    return NextResponse.json({ 
      success: true,
      pointsEarned: pointsToAdd,
      metrics: updatedMetrics
    })

  } catch (error) {
    console.error('Metrics update error:', error)
    return NextResponse.json({ error: "Failed to update metrics" }, { status: 500 })
  }
}

