import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GradeTable } from '@/components/calculator/GradeTable';
import { SGPACalculator } from '@/components/calculator/SGPACalculator';
import { CGPACalculator } from '@/components/calculator/CGPACalculator';
import { PercentageCalculator } from '@/components/calculator/PercentageCalculator';
import { GPATargetCalculator } from '@/components/calculator/GPATargetCalculator';
import { CGPAPrediction } from '@/components/calculator/CGPAPrediction';
import { SemesterHistory } from '@/components/calculator/SemesterHistory';
import { SemesterProfiles } from '@/components/calculator/SemesterProfiles';
import { Instructions } from '@/components/calculator/Instructions';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SemesterHistoryEntry } from '@/types/calculator';
import adamasLogo from '/logo.png';

const Index = () => {
  const [history, setHistory] = useLocalStorage<SemesterHistoryEntry[]>('adamas-calculator-history', []);

  const handleSaveHistory = (entry: SemesterHistoryEntry) => {
    setHistory(prev => [...prev, entry]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-header py-4 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={adamasLogo} alt="Adamas University" className="h-10 w-auto rounded transition-transform duration-200 hover:scale-105" />
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-white">
                Adamas University
              </h1>
              <p className="text-xs sm:text-sm text-white/80">
                SGPA - CGPA Calculator
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="sgpa" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-8 h-auto gap-1">
            <TabsTrigger value="sgpa" className="text-xs sm:text-sm">SGPA</TabsTrigger>
            <TabsTrigger value="cgpa" className="text-xs sm:text-sm">CGPA</TabsTrigger>
            <TabsTrigger value="percentage" className="text-xs sm:text-sm">%</TabsTrigger>
            <TabsTrigger value="target" className="text-xs sm:text-sm">Target</TabsTrigger>
            <TabsTrigger value="predict" className="text-xs sm:text-sm">Predict</TabsTrigger>
            <TabsTrigger value="profiles" className="text-xs sm:text-sm">Profiles</TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm">History</TabsTrigger>
            <TabsTrigger value="grades" className="text-xs sm:text-sm">Grades</TabsTrigger>
          </TabsList>

          <TabsContent value="sgpa" className="space-y-6">
            <SGPACalculator onSaveHistory={handleSaveHistory} />
            <Instructions />
          </TabsContent>

          <TabsContent value="cgpa" className="space-y-6">
            <CGPACalculator onSaveHistory={handleSaveHistory} />
            <Instructions />
          </TabsContent>

          <TabsContent value="percentage" className="space-y-6">
            <PercentageCalculator onSaveHistory={handleSaveHistory} />
            <Instructions />
          </TabsContent>

          <TabsContent value="target" className="space-y-6">
            <GPATargetCalculator />
            <Instructions />
          </TabsContent>

          <TabsContent value="predict" className="space-y-6">
            <CGPAPrediction />
            <Instructions />
          </TabsContent>

          <TabsContent value="profiles">
            <SemesterProfiles />
          </TabsContent>

          <TabsContent value="history">
            <SemesterHistory history={history} onClearHistory={handleClearHistory} />
          </TabsContent>

          <TabsContent value="grades">
            <GradeTable />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Made for Adamas University students</p>
          <p className="mt-1">Data is stored locally in your browser</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
