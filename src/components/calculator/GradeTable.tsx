import { GRADES } from '@/types/calculator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function GradeTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Adamas University Grading System</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-primary hover:bg-primary">
              <TableHead className="text-primary-foreground font-semibold text-center">Grade</TableHead>
              <TableHead className="text-primary-foreground font-semibold text-center">Marks Range</TableHead>
              <TableHead className="text-primary-foreground font-semibold text-center">Grade Point</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {GRADES.map((grade, index) => (
              <TableRow 
                key={grade.grade} 
                className={index % 2 === 0 ? 'bg-secondary/50' : 'bg-background'}
              >
                <TableCell className="text-center font-medium">{grade.grade}</TableCell>
                <TableCell className="text-center">
                  {grade.grade === 'AB' ? 'Absent' : 
                   grade.grade === 'DB' ? 'Debarred' :
                   grade.grade === 'F' ? `< 35` :
                   `${grade.minMarks} - ${grade.maxMarks}`}
                </TableCell>
                <TableCell className="text-center font-semibold">{grade.gradePoint}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
