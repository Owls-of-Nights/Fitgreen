import { getDb } from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { POINTS } from "@/lib/points"

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log("Raw water endpoint body:", body); // Debug log
    const { waterIntake } = body;
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const db = await getDb();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if it's a new day by comparing the fitness_metrics updatedAt field
    const metricsDoc = await db.collection("fitness_metrics").findOne({ userEmail: session.user.email });
    let isNewDay = false;
    if (metricsDoc && metricsDoc.updatedAt) {
      const lastUpdated = new Date(metricsDoc.updatedAt);
      lastUpdated.setHours(0, 0, 0, 0);
      if (lastUpdated < today) {
        isNewDay = true;
        console.log("Detected a new day, resetting water goal state.");
        // Optionally reset lastWaterPoints in user document for a new day:
        await db.collection("users").updateOne(
          { email: session.user.email },
          { $unset: { lastWaterPoints: "" } }
        );
      }
    }

    // Cap water intake at 2000ml for display purposes
    const cappedWaterIntake = waterIntake >= 2000 ? 2000 : waterIntake;

    // Update water intake with capped value
    await db.collection("fitness_metrics").updateOne(
      { userEmail: session.user.email },
      {
        $set: {
          userEmail: session.user.email,
          waterIntake: cappedWaterIntake,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    let pointsToAdd = 0;
    // Award water goal points if water intake threshold reached and not already awarded today
    if (waterIntake >= 2000) {
      const userDoc = await db.collection("users").findOne(
        { email: session.user.email },
        { projection: { lastWaterPoints: 1, waterStreak: 1, lastWaterDate: 1 } }
      );
      const lastAwarded = userDoc?.lastWaterPoints ? new Date(userDoc.lastWaterPoints) : null;
      console.log("Trigger water goal check: waterIntake =", waterIntake, "lastAwarded =", lastAwarded);
      // Award points if not already awarded today
      if (!lastAwarded || lastAwarded < today) {
        pointsToAdd += POINTS.WATER_GOAL_COMPLETION;
        console.log("Awarding water goal points:", POINTS.WATER_GOAL_COMPLETION);
        await db.collection("users").updateOne(
          { email: session.user.email },
          {
            $inc: { points: pointsToAdd },
            $set: {
              lastActive: new Date(),
              lastWaterPoints: new Date()
            }
          }
        );
      } else {
        console.log("Water points already awarded today");
      }

      // Update water streak: if last water goal achieved yesterday, increment streak; otherwise, reset to 1.
      let newStreak = 1;
      if (userDoc?.lastWaterDate) {
        const lastWaterDate = new Date(userDoc.lastWaterDate);
        lastWaterDate.setHours(0, 0, 0, 0);
        const diffDays = (today.getTime() - lastWaterDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          newStreak = (userDoc.waterStreak || 1) + 1;
        }
      }
      await db.collection("users").updateOne(
        { email: session.user.email },
        { $set: { waterStreak: newStreak, lastWaterDate: today } }
      );

      // Update fitness metrics with the streak icon (e.g., a fire emoji)
      await db.collection("fitness_metrics").updateOne(
        { userEmail: session.user.email },
        { $set: { streakIcon: newStreak > 0 ? "🔥" : "" } },
        { upsert: true }
      );
    } else {
      console.log("Water intake below threshold; no points awarded");
      // Optionally, you can reset streak icon here if needed.
    }

    const updatedMetrics = await db.collection("fitness_metrics").findOne({ userEmail: session.user.email });
    return NextResponse.json({ success: true, pointsEarned: pointsToAdd, metrics: updatedMetrics });
  } catch (error) {
    console.error("Water intake update error:", error);
    return NextResponse.json({ error: "Failed to update water intake" }, { status: 500 });
  }
}

// Optionally add GET to fetch water intake if needed:
// export async function GET() { ... }
