"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Layout from "../components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  bio: z.string().max(500, { message: "Bio must be 500 characters or less" }),
  profilePicture: z.string().url().optional(),
})

type FormData = z.infer<typeof schema>

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (session?.user) {
      setValue("name", session.user.name || "")
      setValue("email", session.user.email || "")
      // Fetch additional user data from the server
      fetchUserData()
    }
  }, [session, status, router, setValue])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const userData = await response.json()
        setValue("bio", userData.bio || "")
        setValue("profilePicture", userData.profilePicture || "")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSuccess("Profile updated successfully")
        setError(null)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "An error occurred while updating the profile")
        setSuccess(null)
      }
    } catch (error) {
      setError("An unexpected error occurred")
      setSuccess(null)
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default" className="mb-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={session?.user?.image || "/placeholder.svg"} alt="Profile picture" />
                  <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="profilePicture">Profile Picture URL</Label>
                  <Input id="profilePicture" type="url" {...register("profilePicture")} />
                  {errors.profilePicture && (
                    <p className="text-red-500 text-sm mt-1">{errors.profilePicture.message}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" {...register("name")} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" {...register("bio")} />
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
              </div>
              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

