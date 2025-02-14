import { Camera, Loader2, type Icon as LucideIcon } from "lucide-react"

// Change the type export to use typeof LucideIcon
export type Icon = typeof LucideIcon

export const Icons = {
  camera: Camera,
  spinner: Loader2,
}

