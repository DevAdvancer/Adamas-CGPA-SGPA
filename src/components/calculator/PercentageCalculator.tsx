import { useState } from 'react';
import { Percent, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SemesterHistoryEntry } from '@/types/calculator';

interface PercentageCalculatorProps {
  onSaveHistory: (entry: SemesterHistoryEntry) => void;
}

export function PercentageCalculator({ onSaveHistory }: PercentageCalculatorProps) {
  const [cgpa, setCgpa] = useState<string>('');
  const [percentage, setPercentage] = useState<number | null>(null);

  const calculatePercentage = () => {
    const cgpaValue = parseFloat(cgpa);
    if (isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > 10) {
      return;
    }

    // Formula: (CGPA - 0.5) × 10
    const result = (cgpaValue - 0.5) * 10;
    const roundedResult = Math.round(result * 100) / 100;
    setPercentage(roundedResult);

    // Save to history
    onSaveHistory({
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      type: 'Percentage',
      result: roundedResult,
      details: `CGPA: ${cgpaValue}`,
    });
  };

  const resetForm = () => {
    setCgpa('');
    setPercentage(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Percent className="h-5 w-5" />
          Percentage Calculator
        </CardTitle>
        <CardDescription>
          Convert your CGPA to percentage using the formula: (CGPA - 0.5) × 10
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
          <span className="text-muted-foreground">Enter CGPA:</span>
          <Input
            type="number"
            min="0"
            max="10"
            step="0.01"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            className="w-32"
            placeholder="e.g., 8.5"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={calculatePercentage} className="gap-2">
            <Calculator className="h-4 w-4" /> Calculate
          </Button>
          <Button onClick={resetForm} variant="secondary">
            Reset
          </Button>
        </div>

        {percentage !== null && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Your Percentage</p>
            <p className="text-4xl font-bold text-primary">{percentage.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground mt-2">
              Formula: ({cgpa} - 0.5) × 10 = {percentage.toFixed(2)}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
