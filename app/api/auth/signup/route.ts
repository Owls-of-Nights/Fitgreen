import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { hash } from "bcryptjs"
import { POINTS } from "@/lib/points"
import { sendEmail } from "@/lib/mailjet"
import { generateVerificationToken } from "@/lib/tokens"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()
    
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      )
    }

    const db = await getDb()

    const normalizedEmail = email.toLowerCase()
    // Check if user exists using normalized email
    const existingUser = await db.collection("users").findOne({ 
      email: normalizedEmail
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" }, 
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 10)
    const verificationToken = generateVerificationToken()
    
    const username = normalizedEmail.split('@')[0] // Added default username

    const newUser = {
      name,
      email: normalizedEmail,
      username, // include username in the new user record
      password: hashedPassword,
      points: POINTS.SIGNUP,
      profilePicture: "",
      emailVerified: false,
      verificationToken,
      createdAt: new Date(),
      lastActive: new Date()
    }

    const result = await db.collection("users").insertOne(newUser)

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`
    await sendEmail(
      email,
      "Verify your email for FitGreen",
      `Please verify your email by clicking on this link: ${verificationUrl}`,
      `
      <h1>Verify your email for FitGreen</h1>
      <p>Dear ${name},</p>
      <p>Please verify your email by clicking on the button below:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      `
    )

    return NextResponse.json({
      success: true,
      message: "User created successfully. Please check your email to verify your account.",
      user: {
        id: result.insertedId.toString(),
        name,
        email,
        points: POINTS.SIGNUP
      }
    }, { status: 201 })

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Registration failed" }, 
      { status: 500 }
    )
  }
}

