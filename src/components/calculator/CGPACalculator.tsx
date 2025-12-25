import { useState } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Semester, SemesterHistoryEntry } from '@/types/calculator';

interface CGPACalculatorProps {
  onSaveHistory: (entry: SemesterHistoryEntry) => void;
}

export function CGPACalculator({ onSaveHistory }: CGPACalculatorProps) {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', sgpa: 0, credits: 20 },
  ]);
  const [cgpa, setCgpa] = useState<number | null>(null);

  const addSemester = () => {
    const newSemester: Semester = {
      id: Date.now().toString(),
      sgpa: 0,
      credits: 20,
    };
    setSemesters([...semesters, newSemester]);
  };

  const removeSemester = (id: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(s => s.id !== id));
    }
  };

  const updateSemester = (id: string, field: keyof Semester, value: number) => {
    setSemesters(semesters.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const calculateCGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    semesters.forEach(semester => {
      totalCredits += semester.credits;
      totalGradePoints += semester.credits * semester.sgpa;
    });

    const result = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    const roundedResult = Math.round(result * 100) / 100;
    setCgpa(roundedResult);

    // Save to history
    onSaveHistory({
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      type: 'CGPA',
      result: roundedResult,
      details: `${semesters.length} semesters, ${totalCredits} total credits`,
    });
  };

  const resetForm = () => {
    setSemesters([{ id: '1', sgpa: 0, credits: 20 }]);
    setCgpa(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          CGPA Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {semesters.map((semester, index) => (
            <div key={semester.id} className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
              <span className="w-24 text-muted-foreground text-sm">Semester {index + 1}</span>
              <Input
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={semester.sgpa || ''}
                onChange={(e) => updateSemester(semester.id, 'sgpa', parseFloat(e.target.value) || 0)}
                className="w-28"
                placeholder="SGPA"
              />
              <Input
                type="number"
                min="1"
                max="50"
                value={semester.credits}
                onChange={(e) => updateSemester(semester.id, 'credits', parseInt(e.target.value) || 1)}
                className="w-28"
                placeholder="Credits"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSemester(semester.id)}
                disabled={semesters.length === 1}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={addSemester} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" /> Add Semester
          </Button>
          <Button onClick={calculateCGPA} className="gap-2">
            <Calculator className="h-4 w-4" /> Calculate CGPA
          </Button>
          <Button onClick={resetForm} variant="secondary">
            Reset
          </Button>
        </div>

        {cgpa !== null && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Your CGPA</p>
            <p className="text-4xl font-bold text-primary">{cgpa.toFixed(2)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
