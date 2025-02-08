import { getDb } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse("Not allowed in production", { status: 403 })
  }

  try {
    const db = await getDb()
    await db.collection("users").deleteMany({})
    await db.collection("fitness_metrics").deleteMany({})
    
    return NextResponse.json({ 
      success: true, 
      message: "Database cleared successfully" 
    })
  } catch (error) {
    console.error("Clear DB error:", error)
    return new NextResponse("Failed to clear database", { status: 500 })
  }
}
