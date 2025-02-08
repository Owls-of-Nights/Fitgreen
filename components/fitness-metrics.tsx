'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface FitnessMetrics {
  weight: number
  height: number
  waterIntake: number
  sleepHours: number
  targetWaterIntake: number
  targetSleepHours: number
}

export function FitnessMetrics() {
  const [metrics, setMetrics] = useState<FitnessMetrics>({
    weight: 0,
    height: 0,
    waterIntake: 0,
    sleepHours: 0,
    targetWaterIntake: 2000, // Default 2L
    targetSleepHours: 8, // Default 8h
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/fitness/metrics')
      if (response.ok) {
        const data = await response.json()
        setMetrics(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Error fetching metrics:', error)
    }
  }

  const updateMetrics = async () => {
    try {
      const response = await fetch('/api/fitness/metrics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
      })

      if (response.ok) {
        setMessage('Metrics updated successfully!')
      } else {
        setMessage('Failed to update metrics')
      }
    } catch (error) {
      setMessage('Error updating metrics')
    }
  }

  const calculateBMI = () => {
    if (metrics.weight && metrics.height) {
      const heightInMeters = metrics.height / 100
      return (metrics.weight / (heightInMeters * heightInMeters)).toFixed(1)
    }
    return 'N/A'
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Fitness Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert className="mb-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={metrics.weight || ''}
                onChange={(e) => setMetrics(prev => ({ ...prev, weight: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={metrics.height || ''}
                onChange={(e) => setMetrics(prev => ({ ...prev, height: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="waterIntake">Water Intake (ml)</Label>
              <Input
                id="waterIntake"
                type="number"
                value={metrics.waterIntake || ''}
                onChange={(e) => setMetrics(prev => ({ ...prev, waterIntake: Number(e.target.value) }))}
              />
              <Progress value={(metrics.waterIntake / metrics.targetWaterIntake) * 100} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="sleep">Sleep Hours</Label>
              <Input
                id="sleep"
                type="number"
                value={metrics.sleepHours || ''}
                onChange={(e) => setMetrics(prev => ({ ...prev, sleepHours: Number(e.target.value) }))}
              />
              <Progress value={(metrics.sleepHours / metrics.targetSleepHours) * 100} className="mt-2" />
            </div>
          </div>

          <div className="mt-4">
            <Card>
              <CardContent className="pt-4">
                <p className="text-lg font-semibold">BMI: {calculateBMI()}</p>
              </CardContent>
            </Card>
          </div>

          <Button onClick={updateMetrics} className="mt-4">
            Update Metrics
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
