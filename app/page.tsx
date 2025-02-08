"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Layout from "./components/layout"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import DeveloperCard from "./components/developer-card"
import ChatBotIframe from "./components/ChatBotIframe"
import Globe from "./components/globe"

export default function Home() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, 200])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])

  return (
    <Layout>
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="z-10 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
            Get Fit. Stay Green. Change the World.
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Join our community of health-conscious and eco-friendly individuals making a difference one step at a time.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/fitness"
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-full inline-flex items-center transition duration-300 ease-in-out"
            >
              Get Started
              <ArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          style={{ y: y1 }}
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
        />
        <motion.div
          style={{ y: y1 }}
          className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
        />
      </section>

      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FitGreen?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🏋️‍♀️"
              title="Personalized Fitness"
              description="Get customized workout plans tailored to your goals and preferences."
            />
            <FeatureCard
              icon="🌱"
              title="Eco-Friendly Living"
              description="Learn how to reduce your carbon footprint and live a more sustainable life."
            />
            <FeatureCard
              icon="🏆"
              title="Gamified Experience"
              description="Earn rewards, compete with friends, and stay motivated on your journey."
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">AI Assistant</h2>
          <ChatBotIframe />
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Developers</h2>
          <div className="flex justify-center space-x-8">
            <DeveloperCard
              name="Narayan Bhusal"
              role="Frontend Developer | UI/UX Designer"
              image="https://iili.io/2Z7vtOQ.png"
              github="https://github.com/naranbhusal02"
              linkedin="https://linkedin.com/in/naranbhusal02"
              twitter="https://twitter.com/naranbhusal02"
            />
            <DeveloperCard
              name="Nayan Acharya"
              role="Backend Developer"
              image="https://iili.io/2Z7vNls.jpg"
              github="https://github.com/nayan135"
              linkedin="https://linkedin.com/in/nayan135"
              twitter="https://x.com/Nooneknows135"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Welcome to FitGreen</h2>
          <Globe />
        </div>
      </section>
    </Layout>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  )
}

