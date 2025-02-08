"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Layout from "../components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface LeaderboardUser {
  _id: string;
  name: string;
  points: number;
  profilePicture: string;
}

export default function ChallengesPage() {
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  const challenges = [
    { id: 1, name: "30-Day Fitness Challenge", progress: 60 },
    { id: 2, name: "Zero Waste Week", progress: 80 },
    { id: 3, name: "10k Steps Daily", progress: 40 },
  ]

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      if (response.ok) {
        const data = await response.json()
        setLeaderboardUsers(data)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
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
        <h1 className="text-3xl font-bold mb-8">Challenges & Leaderboards</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Active Challenges</h2>
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{challenge.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={challenge.progress} className="w-full" />
                  <p className="mt-2 text-center">{challenge.progress}% Complete</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading leaderboard...</p>
                ) : (
                  <ul className="space-y-4">
                    {leaderboardUsers.map((user, index) => (
                      <li key={user._id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={index < 3 ? "default" : "secondary"}
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                          >
                            {index + 1}
                          </Badge>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.profilePicture || ''} />
                            <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {user.points || 0} pts
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </Layout>
  )
}

