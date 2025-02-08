interface CalculatorField {
  name: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
  defaultValue?: number | string;
}

interface CalculatorProps {
  title: string;
  fields: CalculatorField[];
  calculate: (values: Record<string, number | string>) => number;
  resultLabel: string;
  resultUnit: string;
  onSubmit?: (values: Record<string, number | string>) => void;
}

// ...existing imports...

export default function Calculator({ 
  title, 
  fields, 
  calculate, 
  resultLabel, 
  resultUnit,
  onSubmit 
}: CalculatorProps) {
  const [values, setValues] = useState<Record<string, number | string>>(() => {
    // Initialize with default values if provided
    const defaults: Record<string, number | string> = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        defaults[field.name] = field.defaultValue;
      }
    });
    return defaults;
  });
  const [result, setResult] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (calculate) {
      const calculatedResult = calculate(values)
      setResult(calculatedResult)
    }
    if (onSubmit) {
      onSubmit(values)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === 'select' ? (
                <Select 
                  onValueChange={(value) => setValues(prev => ({ ...prev, [field.name]: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  onChange={(e) => setValues(prev => ({ 
                    ...prev, 
                    [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value 
                  }))}
                />
              )}
            </div>
          ))}
          <Button type="submit" className="w-full">Save Metrics</Button>
        </form>
        {result !== null && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">{resultLabel}</p>
            <p className="text-2xl font-bold">{result.toFixed(1)} {resultUnit}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
