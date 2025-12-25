import { useState, useMemo } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Subject, getGradeFromMarks, SemesterHistoryEntry, GRADES } from '@/types/calculator';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useConfetti } from '@/hooks/useConfetti';
import { toast } from '@/hooks/use-toast';

interface SGPACalculatorProps {
  onSaveHistory: (entry: SemesterHistoryEntry) => void;
}

interface SubjectWithMarks extends Subject {
  marks: number;
}

const GRADE_COLORS: Record<string, string> = {
  'O': '#22c55e',
  'A+': '#3b82f6',
  'A': '#06b6d4',
  'B+': '#8b5cf6',
  'B': '#f59e0b',
  'C': '#f97316',
  'P': '#ef4444',
  'F': '#dc2626',
};

export function SGPACalculator({ onSaveHistory }: SGPACalculatorProps) {
  const [subjects, setSubjects] = useState<SubjectWithMarks[]>([
    { id: '1', name: '', credits: 3, grade: 'O', marks: 90 },
  ]);
  const [sgpa, setSgpa] = useState<number | null>(null);
  const { fireConfetti } = useConfetti();

  const gradeDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    subjects.forEach(subject => {
      const { grade } = getGradeFromMarks(subject.marks);
      distribution[grade] = (distribution[grade] || 0) + 1;
    });
    return Object.entries(distribution).map(([grade, count]) => ({
      name: grade,
      value: count,
      color: GRADE_COLORS[grade] || '#6b7280',
    }));
  }, [subjects]);

  const addSubject = () => {
    const newSubject: SubjectWithMarks = {
      id: Date.now().toString(),
      name: '',
      credits: 3,
      grade: 'O',
      marks: 90,
    };
    setSubjects([...subjects, newSubject]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id: string, field: string, value: string | number) => {
    setSubjects(subjects.map(s => {
      if (s.id !== id) return s;
      
      if (field === 'marks') {
        const marks = Math.min(100, Math.max(0, Number(value) || 0));
        const { grade } = getGradeFromMarks(marks);
        return { ...s, marks, grade };
      }
      
      return { ...s, [field]: value };
    }));
  };

  const calculateSGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    subjects.forEach(subject => {
      const { gradePoint } = getGradeFromMarks(subject.marks);
      totalCredits += subject.credits;
      totalGradePoints += subject.credits * gradePoint;
    });

    const result = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    const roundedResult = Math.round(result * 100) / 100;
    setSgpa(roundedResult);

    // Fire confetti for high SGPA (8+)
    if (roundedResult >= 8) {
      fireConfetti();
      toast({
        title: "🎉 Excellent Performance!",
        description: `Congratulations! You achieved an SGPA of ${roundedResult.toFixed(2)}!`,
      });
    }

    onSaveHistory({
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      type: 'SGPA',
      result: roundedResult,
      details: `${subjects.length} subjects, ${totalCredits} credits`,
    });
  };

  const resetForm = () => {
    setSubjects([{ id: '1', name: '', credits: 3, grade: 'O', marks: 90 }]);
    setSgpa(null);
  };

  const getGradeBadgeVariant = (grade: string) => {
    if (['O', 'A+', 'A'].includes(grade)) return 'default';
    if (['B+', 'B'].includes(grade)) return 'secondary';
    if (['C', 'P'].includes(grade)) return 'outline';
    return 'destructive';
  };

  const getGradeRangeLabel = (marks: number) => {
    const gradeInfo = GRADES.find(g => marks >= g.minMarks && marks <= g.maxMarks);
    if (gradeInfo) {
      return `${gradeInfo.minMarks}-${gradeInfo.maxMarks}`;
    }
    return '0-34';
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          SGPA Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {subjects.map((subject, index) => (
            <div 
              key={subject.id} 
              className="p-3 border rounded-lg bg-muted/30 space-y-3 transition-all duration-200 hover:shadow-sm hover:border-primary/30"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
                <span className="w-8 text-muted-foreground text-sm font-medium">{index + 1}.</span>
                <Input
                  placeholder="Subject name (optional)"
                  value={subject.name}
                  onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                  className="flex-1 min-w-[120px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={subject.credits}
                  onChange={(e) => updateSubject(subject.id, 'credits', parseInt(e.target.value) || 1)}
                  className="w-20 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  placeholder="Credits"
                />
                <Badge 
                  variant={getGradeBadgeVariant(subject.grade)} 
                  className="w-16 justify-center text-sm transition-all duration-200"
                >
                  {subject.grade} ({getGradeFromMarks(subject.marks).gradePoint})
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSubject(subject.id)}
                  disabled={subjects.length === 1}
                  className="text-destructive hover:text-destructive transition-all duration-200 hover:scale-110"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-3 pl-8">
                <span className="text-xs text-muted-foreground w-16">Marks:</span>
                <Slider
                  value={[subject.marks]}
                  onValueChange={(value) => updateSubject(subject.id, 'marks', value[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-20 text-right">
                  {subject.marks} <span className="text-xs text-muted-foreground">({getGradeRangeLabel(subject.marks)})</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={addSubject} variant="outline" className="gap-2 transition-all duration-200 hover:scale-105">
            <Plus className="h-4 w-4" /> Add Subject
          </Button>
          <Button onClick={calculateSGPA} className="gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md">
            <Calculator className="h-4 w-4" /> Calculate SGPA
          </Button>
          <Button onClick={resetForm} variant="secondary" className="transition-all duration-200 hover:scale-105">
            Reset
          </Button>
        </div>

        {subjects.length > 0 && (
          <div className="border rounded-lg p-4 transition-all duration-300">
            <h4 className="text-sm font-medium mb-3 text-center">Grade Distribution</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {gradeDistribution.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {sgpa !== null && (
          <div className="p-4 bg-primary/10 rounded-lg text-center animate-scale-in">
            <p className="text-sm text-muted-foreground">Your SGPA</p>
            <p className="text-4xl font-bold text-primary animate-pulse-soft">{sgpa.toFixed(2)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
