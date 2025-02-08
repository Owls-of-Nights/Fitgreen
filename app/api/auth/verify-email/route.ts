import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Missing verification token" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    const user = await db.collection("users").findOne({ verificationToken: token })

    if (!user) {
      return NextResponse.json({ error: "Invalid verification token" }, { status: 400 })
    }

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: { emailVerified: true },
        $unset: { verificationToken: "" },
      },
    )

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?verified=true`)
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

