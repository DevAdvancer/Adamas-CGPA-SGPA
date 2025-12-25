import { useState } from 'react';
import { Target, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GRADES } from '@/types/calculator';

export function GPATargetCalculator() {
  const [currentCGPA, setCurrentCGPA] = useState('');
  const [completedCredits, setCompletedCredits] = useState('');
  const [targetCGPA, setTargetCGPA] = useState('');
  const [upcomingCredits, setUpcomingCredits] = useState('');
  const [result, setResult] = useState<{
    requiredSGPA: number;
    isAchievable: boolean;
    message: string;
  } | null>(null);

  const calculateRequiredSGPA = () => {
    const current = parseFloat(currentCGPA);
    const completed = parseFloat(completedCredits);
    const target = parseFloat(targetCGPA);
    const upcoming = parseFloat(upcomingCredits);

    if (isNaN(current) || isNaN(completed) || isNaN(target) || isNaN(upcoming)) {
      setResult({
        requiredSGPA: 0,
        isAchievable: false,
        message: 'Please fill in all fields with valid numbers',
      });
      return;
    }

    if (current < 0 || current > 10 || target < 0 || target > 10) {
      setResult({
        requiredSGPA: 0,
        isAchievable: false,
        message: 'CGPA must be between 0 and 10',
      });
      return;
    }

    // Formula: Required SGPA = (Target CGPA × Total Credits - Current CGPA × Completed Credits) / Upcoming Credits
    const totalCredits = completed + upcoming;
    const requiredSGPA = (target * totalCredits - current * completed) / upcoming;

    if (requiredSGPA > 10) {
      setResult({
        requiredSGPA,
        isAchievable: false,
        message: `You need an SGPA of ${requiredSGPA.toFixed(2)}, which is above the maximum (10). Try a lower target CGPA.`,
      });
    } else if (requiredSGPA < 0) {
      setResult({
        requiredSGPA: 0,
        isAchievable: true,
        message: `You've already exceeded your target! Even with minimum grades, you'll surpass ${target.toFixed(2)} CGPA.`,
      });
    } else {
      // Find the minimum grade needed
      const minGrade = GRADES.find(g => g.gradePoint >= requiredSGPA && g.gradePoint > 0);
      const gradeHint = minGrade 
        ? `You need an average grade of at least "${minGrade.grade}" (${minGrade.gradePoint} points) across all subjects.`
        : '';

      setResult({
        requiredSGPA,
        isAchievable: true,
        message: `You need an SGPA of ${requiredSGPA.toFixed(2)} in your upcoming semester. ${gradeHint}`,
      });
    }
  };

  const handleReset = () => {
    setCurrentCGPA('');
    setCompletedCredits('');
    setTargetCGPA('');
    setUpcomingCredits('');
    setResult(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          GPA Target Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currentCGPA">Current CGPA</Label>
            <Input
              id="currentCGPA"
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="e.g., 7.5"
              value={currentCGPA}
              onChange={(e) => setCurrentCGPA(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="completedCredits">Completed Credits</Label>
            <Input
              id="completedCredits"
              type="number"
              min="0"
              placeholder="e.g., 80"
              value={completedCredits}
              onChange={(e) => setCompletedCredits(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetCGPA">Target CGPA</Label>
            <Input
              id="targetCGPA"
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="e.g., 8.0"
              value={targetCGPA}
              onChange={(e) => setTargetCGPA(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="upcomingCredits">Upcoming Semester Credits</Label>
            <Input
              id="upcomingCredits"
              type="number"
              min="1"
              placeholder="e.g., 24"
              value={upcomingCredits}
              onChange={(e) => setUpcomingCredits(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={calculateRequiredSGPA} className="flex-1">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Required SGPA
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {result && (
          <div
            className={`p-4 rounded-lg border ${
              result.isAchievable
                ? 'bg-success/10 border-success/30 text-success'
                : 'bg-destructive/10 border-destructive/30 text-destructive'
            }`}
          >
            <p className="font-medium">{result.message}</p>
          </div>
        )}

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">How it works</h4>
          <p className="text-sm text-muted-foreground">
            This calculator determines the SGPA you need in your upcoming semester to achieve your target CGPA. 
            Enter your current CGPA, total completed credits, your goal CGPA, and the credits you'll take next semester.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
