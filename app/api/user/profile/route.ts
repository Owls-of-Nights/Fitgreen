import { getDb } from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET() {
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

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      bio: user.bio || "",
      profilePicture: user.profilePicture || "",
    })
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

