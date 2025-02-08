import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { compare } from "bcryptjs"
import { User } from "@/types/user"
import { sendEmail } from "@/lib/mailjet"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDb()
    const user = await db.collection<User>("users").findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    const safeUser = excludePassword(user)

    // Send login success email
    await sendEmail(
      email,
      "Login Successful",
      `You have successfully logged in to FitGreen.`,
      `
      <h1>Login Successful</h1>
      <p>Dear ${user.name},</p>
      <p>You have successfully logged in to FitGreen.</p>
      `
    )

    return NextResponse.json({ success: true, user: safeUser })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

function excludePassword(user: User) {
  const { password, ...safeUser } = user
  return safeUser
}

