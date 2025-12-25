import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function Instructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          How to Use
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="sgpa">
            <AccordionTrigger>How to Calculate SGPA?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2">
              <p>1. Add all your subjects for the semester</p>
              <p>2. Enter the credit hours for each subject</p>
              <p>3. Select the grade you received</p>
              <p>4. Click "Calculate SGPA" to get your result</p>
              <p className="mt-2 text-sm">
                <strong>Formula:</strong> SGPA = Σ(Credit × Grade Point) / Σ(Credits)
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cgpa">
            <AccordionTrigger>How to Calculate CGPA?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2">
              <p>1. Add all your completed semesters</p>
              <p>2. Enter the SGPA for each semester</p>
              <p>3. Enter the total credits for each semester</p>
              <p>4. Click "Calculate CGPA" to get your cumulative GPA</p>
              <p className="mt-2 text-sm">
                <strong>Formula:</strong> CGPA = Σ(SGPA × Credits) / Σ(Credits)
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="percentage">
            <AccordionTrigger>How to Convert CGPA to Percentage?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2">
              <p>1. Enter your CGPA (0-10 scale)</p>
              <p>2. Click "Calculate" to get your percentage</p>
              <p className="mt-2 text-sm">
                <strong>Formula:</strong> Percentage = (CGPA - 0.5) × 10
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
