import { getDb } from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { name, email, bio, profilePicture, points } = body

    // Validate base64 image size (if provided)
    if (profilePicture && profilePicture.length > 5 * 1024 * 1024) { // 5MB limit
      return new NextResponse("Image size too large", { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          name,
          email,
          bio,
          profilePicture,
          points: points || 0,
          updatedAt: new Date(),
        },
      }
    )

    if (!result.matchedCount) {
      return new NextResponse("User not found", { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      user: {
        name,
        email,
        bio,
        profilePicture
      }
    })
  } catch (error) {
    console.error('Update error:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

