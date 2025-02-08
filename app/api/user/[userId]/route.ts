import { getDb } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId
    if (!ObjectId.isValid(userId)) {
      return new NextResponse("Invalid user ID", { status: 400 })
    }

    const db = await getDb()
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      {
        projection: {
          password: 0,
          email: 0,
          // Only show public information
          name: 1,
          profilePicture: 1,
          points: 1,
          fitnessProgress: 1,
          joinedAt: 1,
          lastActive: 1
        }
      }
    )

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
