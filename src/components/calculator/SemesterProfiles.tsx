import { useState } from 'react';
import { Plus, Trash2, BarChart3, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SemesterProfile {
  id: string;
  name: string;
  sgpa: number;
  credits: number;
  subjects: number;
  createdAt: string;
}

export function SemesterProfiles() {
  const [profiles, setProfiles] = useLocalStorage<SemesterProfile[]>('adamas-semester-profiles', []);
  const [newProfileName, setNewProfileName] = useState('');
  const [newSgpa, setNewSgpa] = useState('');
  const [newCredits, setNewCredits] = useState('');
  const [newSubjects, setNewSubjects] = useState('');
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);

  const addProfile = () => {
    if (!newProfileName.trim() || !newSgpa) return;
    
    const profile: SemesterProfile = {
      id: Date.now().toString(),
      name: newProfileName.trim(),
      sgpa: parseFloat(newSgpa) || 0,
      credits: parseInt(newCredits) || 0,
      subjects: parseInt(newSubjects) || 0,
      createdAt: new Date().toLocaleDateString(),
    };
    
    setProfiles([...profiles, profile]);
    setNewProfileName('');
    setNewSgpa('');
    setNewCredits('');
    setNewSubjects('');
  };

  const deleteProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
    setSelectedProfiles(selectedProfiles.filter(pid => pid !== id));
  };

  const toggleProfileSelection = (id: string) => {
    if (selectedProfiles.includes(id)) {
      setSelectedProfiles(selectedProfiles.filter(pid => pid !== id));
    } else if (selectedProfiles.length < 4) {
      setSelectedProfiles([...selectedProfiles, id]);
    }
  };

  const comparisonData = profiles
    .filter(p => selectedProfiles.includes(p.id))
    .map(p => ({
      name: p.name,
      sgpa: p.sgpa,
      credits: p.credits,
    }));

  const getBarColor = (sgpa: number) => {
    if (sgpa >= 9) return '#22c55e';
    if (sgpa >= 8) return '#3b82f6';
    if (sgpa >= 7) return '#06b6d4';
    if (sgpa >= 6) return '#f59e0b';
    return '#ef4444';
  };

  const getSgpaBadgeVariant = (sgpa: number) => {
    if (sgpa >= 8) return 'default';
    if (sgpa >= 6) return 'secondary';
    return 'outline';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Add Semester Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input
              placeholder="Semester name"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              className="col-span-2 sm:col-span-1"
            />
            <Input
              type="number"
              placeholder="SGPA"
              min="0"
              max="10"
              step="0.01"
              value={newSgpa}
              onChange={(e) => setNewSgpa(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Credits"
              min="0"
              value={newCredits}
              onChange={(e) => setNewCredits(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Subjects"
              min="0"
              value={newSubjects}
              onChange={(e) => setNewSubjects(e.target.value)}
            />
          </div>
          <Button onClick={addProfile} className="gap-2 transition-all duration-200 hover:scale-105">
            <Plus className="h-4 w-4" /> Save Profile
          </Button>
        </CardContent>
      </Card>

      {profiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Saved Profiles</span>
              <span className="text-sm font-normal text-muted-foreground">
                Select up to 4 to compare
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profiles.map((profile, index) => (
                <div
                  key={profile.id}
                  className={`p-3 border rounded-lg transition-all duration-200 cursor-pointer ${
                    selectedProfiles.includes(profile.id)
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'hover:border-primary/50 hover:bg-muted/30'
                  }`}
                  onClick={() => toggleProfileSelection(profile.id)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedProfiles.includes(profile.id)}
                        onChange={() => toggleProfileSelection(profile.id)}
                        className="h-4 w-4 rounded border-primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <p className="font-medium">{profile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {profile.subjects} subjects • {profile.credits} credits • {profile.createdAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSgpaBadgeVariant(profile.sgpa)} className="text-sm">
                        {profile.sgpa.toFixed(2)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProfile(profile.id);
                        }}
                        className="text-destructive hover:text-destructive transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedProfiles.length >= 2 && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Comparison Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="sgpa" radius={[4, 4, 0, 0]} animationDuration={800}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.sgpa)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {comparisonData.map((profile) => (
                <div key={profile.name} className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground truncate">{profile.name}</p>
                  <p className="text-lg font-bold" style={{ color: getBarColor(profile.sgpa) }}>
                    {profile.sgpa.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {profiles.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No semester profiles saved yet.</p>
          <p className="text-sm">Add your first profile above to start tracking!</p>
        </div>
      )}
    </div>
  );
}
