import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyPassword, excludePassword } from "@/lib/auth"
import { sendEmail } from "@/lib/mailjet"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const client = await clientPromise
    const db = client.db()

    const user = await db.collection("users").findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 })
    }

    const safeUser = excludePassword(user)

    // Send login success email
    await sendEmail(
      email,
      "Successful Login to FitGreen",
      "You have successfully logged in to your FitGreen account.",
      `<h1>Successful Login</h1>
      <p>Dear ${user.name},</p>
      <p>You have successfully logged in to your FitGreen account.</p>
      <p>If this wasn't you, please contact our support team immediately.</p>`,
    )

    return NextResponse.json({ user: safeUser })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

