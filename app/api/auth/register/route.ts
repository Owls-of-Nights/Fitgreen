import { getDb } from "@/lib/mongodb"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import { POINTS } from "@/lib/points"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()
    
    if (!email || !password || !name) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const db = await getDb()
    const normalizedEmail = email.toLowerCase()
    // Check if user exists using normalized email
    const existingUser = await db.collection("users").findOne({ email: normalizedEmail })

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "User already exists" }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const hashedPassword = await hash(password, 10)
    
    const username = normalizedEmail.split('@')[0]  // Added default username

    const newUser = {
      name,
      email: normalizedEmail, // Store email in lowercase
      username, // include username here as well
      password: hashedPassword,
      points: POINTS.SIGNUP,
      profilePicture: "",
      createdAt: new Date(),
      lastActive: new Date(),
      verified: false
    }

    const result = await db.collection("users").insertOne(newUser)
    console.log("User created with ID:", result.insertedId)

    return NextResponse.json({
      user: {
        id: result.insertedId.toString(),
        name,
        email,
        points: POINTS.SIGNUP
      }
    })
  } catch (error) {
    console.error("Registration error:", error)
    return new NextResponse(
      JSON.stringify({ error: "Registration failed" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
