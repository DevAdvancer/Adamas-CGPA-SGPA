import { useState } from 'react';
import { TrendingUp, Plus, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useConfetti } from '@/hooks/useConfetti';

interface FutureSemester {
  id: string;
  name: string;
  expectedSgpa: number;
  credits: number;
}

export function CGPAPrediction() {
  const [currentCgpa, setCurrentCgpa] = useState<string>('');
  const [completedCredits, setCompletedCredits] = useState<string>('');
  const [futureSemesters, setFutureSemesters] = useState<FutureSemester[]>([
    { id: '1', name: 'Semester 1', expectedSgpa: 8, credits: 20 },
  ]);
  const [prediction, setPrediction] = useState<{ finalCgpa: number; chartData: any[] } | null>(null);
  const { fireConfetti } = useConfetti();

  const addSemester = () => {
    const newSemester: FutureSemester = {
      id: Date.now().toString(),
      name: `Semester ${futureSemesters.length + 1}`,
      expectedSgpa: 8,
      credits: 20,
    };
    setFutureSemesters([...futureSemesters, newSemester]);
  };

  const removeSemester = (id: string) => {
    if (futureSemesters.length > 1) {
      setFutureSemesters(futureSemesters.filter(s => s.id !== id));
    }
  };

  const updateSemester = (id: string, field: keyof FutureSemester, value: string | number) => {
    setFutureSemesters(futureSemesters.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const calculatePrediction = () => {
    const cgpa = parseFloat(currentCgpa) || 0;
    const credits = parseInt(completedCredits) || 0;
    
    let runningCredits = credits;
    let runningPoints = cgpa * credits;
    
    const chartData = [
      { name: 'Current', cgpa: cgpa, credits: credits }
    ];

    futureSemesters.forEach((semester, index) => {
      runningCredits += semester.credits;
      runningPoints += semester.expectedSgpa * semester.credits;
      const newCgpa = runningCredits > 0 ? runningPoints / runningCredits : 0;
      
      chartData.push({
        name: semester.name,
        cgpa: Math.round(newCgpa * 100) / 100,
        credits: runningCredits,
      });
    });

    const finalCgpa = runningCredits > 0 ? runningPoints / runningCredits : 0;
    const roundedFinal = Math.round(finalCgpa * 100) / 100;
    
    setPrediction({ finalCgpa: roundedFinal, chartData });

    if (roundedFinal >= 8) {
      fireConfetti();
    }
  };

  const resetForm = () => {
    setCurrentCgpa('');
    setCompletedCredits('');
    setFutureSemesters([{ id: '1', name: 'Semester 1', expectedSgpa: 8, credits: 20 }]);
    setPrediction(null);
  };

  const getGradeClass = (cgpa: number) => {
    if (cgpa >= 9) return 'text-green-500';
    if (cgpa >= 8) return 'text-blue-500';
    if (cgpa >= 7) return 'text-cyan-500';
    if (cgpa >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            CGPA Prediction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current CGPA</label>
              <Input
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="e.g., 7.5"
                value={currentCgpa}
                onChange={(e) => setCurrentCgpa(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Completed Credits</label>
              <Input
                type="number"
                min="0"
                placeholder="e.g., 80"
                value={completedCredits}
                onChange={(e) => setCompletedCredits(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Future Semesters</h4>
              <Button 
                onClick={addSemester} 
                variant="outline" 
                size="sm" 
                className="gap-1 transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-3 w-3" /> Add
              </Button>
            </div>

            {futureSemesters.map((semester, index) => (
              <div 
                key={semester.id} 
                className="p-4 border rounded-lg bg-muted/30 space-y-3 transition-all duration-200 hover:shadow-sm hover:border-primary/30"
              >
                <div className="flex items-center gap-3">
                  <Input
                    value={semester.name}
                    onChange={(e) => updateSemester(semester.id, 'name', e.target.value)}
                    className="flex-1"
                    placeholder="Semester name"
                  />
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={semester.credits}
                    onChange={(e) => updateSemester(semester.id, 'credits', parseInt(e.target.value) || 20)}
                    className="w-24"
                    placeholder="Credits"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSemester(semester.id)}
                    disabled={futureSemesters.length === 1}
                    className="text-destructive hover:text-destructive transition-all duration-200 hover:scale-110"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24">Expected SGPA:</span>
                  <Slider
                    value={[semester.expectedSgpa]}
                    onValueChange={(value) => updateSemester(semester.id, 'expectedSgpa', value[0])}
                    min={0}
                    max={10}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className={`text-sm font-bold w-12 text-right ${getGradeClass(semester.expectedSgpa)}`}>
                    {semester.expectedSgpa.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={calculatePrediction} 
              className="gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md"
            >
              <Sparkles className="h-4 w-4" /> Predict CGPA
            </Button>
            <Button 
              onClick={resetForm} 
              variant="secondary" 
              className="transition-all duration-200 hover:scale-105"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {prediction && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Prediction Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Predicted Final CGPA</p>
              <p className={`text-5xl font-bold ${getGradeClass(prediction.finalCgpa)}`}>
                {prediction.finalCgpa.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                After {futureSemesters.length} more semester{futureSemesters.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prediction.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [value.toFixed(2), 'CGPA']}
                  />
                  <ReferenceLine y={8} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: 'Distinction', fontSize: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="cgpa"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8, fill: 'hsl(var(--primary))' }}
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {prediction.chartData.map((point, idx) => (
                <div key={idx} className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground truncate">{point.name}</p>
                  <p className={`text-lg font-bold ${getGradeClass(point.cgpa)}`}>
                    {point.cgpa.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">{point.credits} cr</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
