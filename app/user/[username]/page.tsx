import { getDb } from "@/lib/mongodb"
import { notFound } from "next/navigation"
import Layout from "@/app/components/layout"

interface UserInfoProps {
  params: {
    username: string
  }
}

export default async function UserInfo({ params }: UserInfoProps) {
  console.log("Dynamic route params:", params) // Debug log

  const db = await getDb()
  const user = await db.collection("users").findOne({ 
    username: params.username 
  })
  
  console.log("User record from DB:", user) // Debug log

  if (!user) {
    return notFound()
  }

  const metrics = await db.collection("fitness_metrics").findOne({ 
    userEmail: user.email 
  })

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">User Profile</h1>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <span className="text-gray-500">@{user.username}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Age</p>
                  <p className="font-medium">{metrics?.age || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Weight</p>
                  <p className="font-medium">{metrics?.weight || 'N/A'} kg</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Height</p>
                  <p className="font-medium">{metrics?.height || 'N/A'} cm</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Water Intake</p>
                  <p className="font-medium">{metrics?.waterIntake || 0}/{metrics?.targetWaterIntake || 2000} ml</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
