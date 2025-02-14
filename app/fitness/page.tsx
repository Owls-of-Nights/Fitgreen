"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Layout from "../components/layout"
import Calculator from "../components/calculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { FitnessDisplay } from "@/components/fitness-display"
import Link from "next/link"
import { ArrowRight } from "react-feather"

interface UserMetrics {
  weight: number;
  height: number;
  waterIntake: number;
  targetWaterIntake: number;
  age: number;
  gender: string;
}

// Add (or update) the type definition for form fields to allow options for select inputs
interface FormField {
  name: string
  label: string
  type: string
  options?: { value: string; label: string }[]
}

export default function FitnessDashboard() {
  const [metrics, setMetrics] = useState<UserMetrics>({
    weight: 0,
    height: 0,
    waterIntake: 0,
    targetWaterIntake: 2000,
    age: 0,
    gender: ''
  })
  const [showCalculator, setShowCalculator] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")

  useEffect(() => {
    fetchUserMetrics()
  }, [])

  useEffect(() => {
    // Hide calculator if we have stored metrics
    if (metrics.weight > 0 && metrics.height > 0) {
      setShowCalculator(false)
    }
  }, [metrics.weight, metrics.height])

  const fetchUserMetrics = async () => {
    try {
      const response = await fetch('/api/fitness/metrics')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
        setUsername(data.username) // Assuming username is returned in the response
      }
    } catch (error) {
      console.error('Error fetching metrics:', error)
    }
  }

  const updateMetrics = async (newMetrics: Partial<UserMetrics>) => {
    try {
      console.log('Updating metrics:', newMetrics) // Debug log
      const response = await fetch('/api/fitness/metrics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMetrics)
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Response data:', data) // Debug log
        if (data.metrics) {
          setMetrics(data.metrics)
        }
        if (data.pointsEarned > 0) {
          toast({
            title: "Points Earned!",
            description: `You earned ${data.pointsEarned} points!`
          })
        }
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update metrics')
      }
    } catch (error: any) {
      console.error('Error updating metrics:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update metrics",
        variant: "destructive"
      })
    }
  }

  const handleHealthMetricsSubmit = (values: Record<string, any>) => {
    const metrics = {
      weight: Number(values.weight),
      height: Number(values.height),
      age: Number(values.age),
      gender: values.gender
    }
    console.log('Submitting health metrics:', metrics) // Debug log
    updateMetrics(metrics)
    setShowCalculator(false)
  }

  const addWater = () => {
    const newWaterIntake = (metrics.waterIntake || 0) + 500
    updateMetrics({ waterIntake: newWaterIntake })
  }

  const getWaterProgress = () => {
    const progress = (metrics.waterIntake / metrics.targetWaterIntake) * 100
    return progress > 100 ? 100 : progress // Cap the progress bar at 100%
  }

  const calculateBMI = (values: Record<string, number>) => {
    const heightInMeters = values.height / 100
    return values.weight / (heightInMeters * heightInMeters)
  }

  // Change calculateCalories function parameter type to UserMetrics
  const calculateCalories = (values: UserMetrics) => {
    const bmr =
      10 * Number(values.weight) +
      6.25 * Number(values.height) -
      5 * Number(values.age) +
      (values.gender === 'male' ? 5 : -161)
    return Math.round(bmr)
  }

  const handleCalculatorSubmit = (type: 'bmi' | 'calories', values: Record<string, number>) => {
    if (type === 'bmi') {
      updateMetrics({
        weight: values.weight,
        height: values.height
      })
    }
  }

  async function handleCalculate() {
    const bodyMetrics = {
      weight: Number(weight),
      height: Number(height),
      age: Number(age),
      gender
    }
    console.log("Sending body metrics:", bodyMetrics)
    const response = await fetch("/api/fitness/body", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyMetrics)
    })
    const data = await response.json()
    console.log("Body metrics response:", data)

  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <h1 className="text-3xl font-bold mb-8">Fitness Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {showCalculator ? (
            <Calculator
              title="Health Metrics"
              fields={[
                { name: "weight", label: "Weight (kg)", type: "number" },
                { name: "height", label: "Height (cm)", type: "number" },
                { name: "age", label: "Age", type: "number" },
                { 
                  name: "gender", 
                  label: "Gender", 
                  type: "select",   
                  options: [
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" }
                  ]
                }
              ]}
              onSubmit={handleHealthMetricsSubmit}
              calculate={calculateBMI}
              resultLabel="Your BMI"
              resultUnit=""
            />
          ) : (
            <FitnessDisplay
              metrics={metrics}
              onEdit={() => setShowCalculator(true)}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle>Base Metabolic Rate (BMR)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-center">
                {calculateCalories(metrics)} kcal/day
              </p>
              <p className="text-sm text-muted-foreground text-center mt-2">
                This is your base calorie need before activity
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Water Intake Progress</span>
                <Button 
                  onClick={addWater}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <span>Add 500ml</span>
                  <span className="text-blue-500">💧</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress 
                value={getWaterProgress()} 
                className="w-full" 
              />
              <p className="mt-2 text-center">
                {metrics.waterIntake}ml / {metrics.targetWaterIntake}ml
                {metrics.waterIntake >= metrics.targetWaterIntake && (
                  <span className="text-green-500 ml-2">✓ Goal reached!</span>
                )}
              </p>
            </CardContent>
          </Card>
        </div>
        {username && (
          <div className="mt-8">
            <Link 
              href={`/user/${username}`}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <span>View Profile</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        )}
      </motion.div>
    </Layout>
  )
}

