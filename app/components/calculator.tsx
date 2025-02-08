"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CalculatorProps {
  title: string
  fields: { name: string; label: string; type: string }[]
  calculate: (values: Record<string, number>) => number
  resultLabel: string
  resultUnit: string
}

export default function Calculator({ title, fields, calculate, resultLabel, resultUnit }: CalculatorProps) {
  const [values, setValues] = useState<Record<string, number>>({})
  const [result, setResult] = useState<number | null>(null)

  const handleInputChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const handleCalculate = () => {
    const calculatedResult = calculate(values)
    setResult(calculatedResult)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input id={field.name} type={field.type} onChange={(e) => handleInputChange(field.name, e.target.value)} />
          </div>
        ))}
        <Button onClick={handleCalculate}>Calculate</Button>
        {result !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-lg font-semibold">
            {resultLabel}: {result.toFixed(2)} {resultUnit}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

