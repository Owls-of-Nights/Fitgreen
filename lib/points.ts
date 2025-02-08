export const POINTS = {
  SIGNUP: 50,
  EMAIL_VERIFICATION: 100,
  DAILY_LOGIN: 10,
  FITNESS_DATA_ENTRY: 100,
  WATER_GOAL_COMPLETION: 200
}

export function calculateWaterGoalPoints(waterIntake: number) {
  return waterIntake >= 2000 ? POINTS.WATER_GOAL_COMPLETION : 0
}

export function calculateFitnessDataPoints(metrics: any) {
  if (metrics.weight && metrics.height && metrics.waterIntake) {
    return POINTS.FITNESS_DATA_ENTRY
  }
  return 0
}
