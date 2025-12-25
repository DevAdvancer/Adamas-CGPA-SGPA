import { History, Trash2, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SemesterHistoryEntry } from '@/types/calculator';
import { exportToCSV, exportToPDF } from '@/lib/exportHistory';

interface SemesterHistoryProps {
  history: SemesterHistoryEntry[];
  onClearHistory: () => void;
}

export function SemesterHistory({ history, onClearHistory }: SemesterHistoryProps) {
  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'SGPA':
        return 'default';
      case 'CGPA':
        return 'secondary';
      case 'Percentage':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Calculation History
        </CardTitle>
        {history.length > 0 && (
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => exportToPDF(history)}>
                  <FileText className="h-4 w-4 mr-2" /> Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToCSV(history)}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" /> Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearHistory}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Clear All
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No calculations yet</p>
            <p className="text-sm">Your calculation history will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...history].reverse().map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm">{entry.date}</TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(entry.type)}>
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {entry.result.toFixed(2)}
                      {entry.type === 'Percentage' && '%'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {entry.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
