import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { getDb } from "@/lib/mongodb"
import { POINTS } from "@/lib/points"
import { User } from "@/types/user"

// A helper to add a timeout to async operations
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Operation timed out")), ms)
  )
  return Promise.race([promise, timeout])
}

const handler = NextAuth({
  debug: true, // Enable debug logs to help troubleshooting
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        // Wrap the DB call with a timeout (e.g. 5000ms)
        const db = await withTimeout(getDb(), 5000)
        const user = await db.collection<User>("users").findOne({
          email: credentials.email
        })

        if (!user) {
          throw new Error("No user found")
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.profilePicture
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  events: {
    async signIn({ user }) {
      const db = await getDb()
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (!user.email) {
        throw new Error("User email is required")
      }

      const userRecord = await db.collection<User>("users").findOne({ email: user.email! })
      if (userRecord && (!userRecord.lastLoginPoint || new Date(userRecord.lastLoginPoint) < today)) {
        await db.collection("users").updateOne(
          { email: user.email! },
          {
            $inc: { points: POINTS.DAILY_LOGIN },
            $set: {
              lastLoginPoint: new Date(),
              lastActive: new Date()
            }
          }
        )
      }
    }
  }
})

export { handler as GET, handler as POST }

