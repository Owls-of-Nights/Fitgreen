"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Layout from "../components/layout"
import SignupForm from "../components/signup-form"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        router.push("/login?signup=success")
      } else {
        const data = await response.json()
        setError(data.error || "Signup failed")
      }
    } catch (error) {
      console.error("Signup error:", error)
      setError("An unexpected error occurred")
    }
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-red-500 text-center">
                {error}
              </motion.div>
            )}
            <SignupForm onSignup={handleSignup} />
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  )
}

