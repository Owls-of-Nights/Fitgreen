import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FitnessDisplayProps {
  metrics: {
    weight: number;
    height: number;
    age: number;
    gender: string;
  };
  onEdit?: () => void;
}

export function FitnessDisplay({ metrics, onEdit }: FitnessDisplayProps) {
  const bmi = metrics.weight / (Math.pow(metrics.height / 100, 2))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          Your Measurements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Height</p>
            <p className="text-2xl font-bold">{metrics.height} cm</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Weight</p>
            <p className="text-2xl font-bold">{metrics.weight} kg</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Age</p>
            <p className="text-2xl font-bold">{metrics.age} years</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gender</p>
            <p className="text-2xl font-bold capitalize">{metrics.gender}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">BMI</p>
          <p className="text-2xl font-bold">{bmi.toFixed(1)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
