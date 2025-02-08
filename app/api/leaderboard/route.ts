import { getDb } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const db = await getDb()
    const users = await db.collection("users")
      .find(
        { points: { $exists: true } }, // Only users with points
        { 
          projection: {
            name: 1,
            points: 1,
            profilePicture: 1,
            lastActive: 1
          },
          sort: { points: -1 },
          limit: 10 // Top 10 users
        }
      )
      .toArray()

    // Format the response
    const formattedUsers = users.map(user => ({
      _id: user._id.toString(),
      name: user.name,
      points: user.points || 0,
      profilePicture: user.profilePicture || '',
      lastActive: user.lastActive
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error('Leaderboard error:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
