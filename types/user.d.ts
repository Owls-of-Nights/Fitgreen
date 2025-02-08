import { ObjectId } from "mongodb"

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string
      NEXTAUTH_URL: string
      NEXTAUTH_SECRET: string
      MAILJET_API_KEY: string
      MAILJET_SECRET_KEY: string
      MAILJET_SENDER_EMAIL: string
    }
  }
}

export interface User {
  _id: ObjectId
  name: string
  email: string
  password: string
  points: number
  profilePicture: string
  emailVerified: boolean
  verificationToken: string
  createdAt: Date
  updatedAt: Date
  lastActive: Date
  lastLoginPoint?: Date
  lastWaterPoints?: Date
}
