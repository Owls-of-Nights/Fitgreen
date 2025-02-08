"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Github, Linkedin, Twitter } from "lucide-react"

interface DeveloperCardProps {
  name: string
  role: string
  image: string
  github: string
  linkedin: string
  twitter: string
}

export default function DeveloperCard({ name, role, image, github, linkedin, twitter }: DeveloperCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      className="w-64 h-80 cursor-pointer perspective"
      onClick={() => setIsFlipped(!isFlipped)}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="absolute w-full h-full backface-hidden rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-lg">
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white text-xl font-semibold">{name}</h3>
              <p className="text-gray-300">{role}</p>
            </div>
          </div>
        </div>
        <div className="absolute w-full h-full backface-hidden rotateY-180 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex flex-col justify-center items-center p-4">
          <h3 className="text-white text-xl font-semibold mb-4">{name}</h3>
          <div className="flex space-x-4">
            <a href={github} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
              <Github size={24} />
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
              <Linkedin size={24} />
            </a>
            <a href={twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
              <Twitter size={24} />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

