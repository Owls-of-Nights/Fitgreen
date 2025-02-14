"use client"

import { motion } from "framer-motion"
import Layout from "../components/layout"
import Calculator from "../components/calculator"
import Globe from "../components/globe"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function SustainabilityDashboard() {
  const calculateCarbonFootprint = (values: Record<string, number>) => {
    return (values.electricity * 0.5 + values.gas * 0.2 + values.car * 0.3 + values.flights * 0.1) * 12
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <h1 className="text-3xl font-bold mb-8">Sustainability Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Calculator
              title="Carbon Footprint Calculator"
              fields={[
                { name: "electricity", label: "Monthly Electricity Usage (kWh)", type: "number" },
                { name: "gas", label: "Monthly Gas Usage (therms)", type: "number" },
                { name: "car", label: "Monthly Car Mileage", type: "number" },
                { name: "flights", label: "Flights per Year", type: "number" },
              ]}
              onSubmit={() => {}}  // Added noop onSubmit handler
              calculate={calculateCarbonFootprint}
              resultLabel="Your Annual Carbon Footprint"
              resultUnit="kg CO2"
            />
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Carbon Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-center">
                  250 <span className="text-sm font-normal">credits</span>
                </div>
                <Progress value={50} className="w-full mt-4" />
                <p className="mt-2 text-center">50% to next level</p>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Global Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <Globe />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Eco-Friendly Diet Score</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={75} className="w-full" />
              <p className="mt-2 text-center">75/100</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Electricity Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={40} className="w-full" />
              <p className="mt-2 text-center">200 kWh / 500 kWh (Monthly Goal)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Green Transport Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={60} className="w-full" />
              <p className="mt-2 text-center">60% of trips</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </Layout>
  )
}

