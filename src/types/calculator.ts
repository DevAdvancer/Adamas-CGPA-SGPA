export interface Grade {
  grade: string;
  minMarks: number;
  maxMarks: number;
  gradePoint: number;
}

export interface Subject {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

export interface Semester {
  id: string;
  sgpa: number;
  credits: number;
}

export interface SemesterHistoryEntry {
  id: string;
  date: string;
  type: 'SGPA' | 'CGPA' | 'Percentage';
  result: number;
  details: string;
}

export const GRADES: Grade[] = [
  { grade: 'O', minMarks: 90, maxMarks: 100, gradePoint: 10 },
  { grade: 'A+', minMarks: 80, maxMarks: 89, gradePoint: 9 },
  { grade: 'A', minMarks: 70, maxMarks: 79, gradePoint: 8 },
  { grade: 'B+', minMarks: 60, maxMarks: 69, gradePoint: 7 },
  { grade: 'B', minMarks: 50, maxMarks: 59, gradePoint: 6 },
  { grade: 'C', minMarks: 40, maxMarks: 49, gradePoint: 5 },
  { grade: 'P', minMarks: 35, maxMarks: 39, gradePoint: 4 },
  { grade: 'F', minMarks: 0, maxMarks: 34, gradePoint: 0 },
  { grade: 'AB', minMarks: 0, maxMarks: 0, gradePoint: 0 },
  { grade: 'DB', minMarks: 0, maxMarks: 0, gradePoint: 0 },
];

export const getGradePoint = (grade: string): number => {
  const found = GRADES.find(g => g.grade === grade);
  return found ? found.gradePoint : 0;
};

export const getGradeFromMarks = (marks: number): { grade: string; gradePoint: number } => {
  if (marks >= 90) return { grade: 'O', gradePoint: 10 };
  if (marks >= 80) return { grade: 'A+', gradePoint: 9 };
  if (marks >= 70) return { grade: 'A', gradePoint: 8 };
  if (marks >= 60) return { grade: 'B+', gradePoint: 7 };
  if (marks >= 50) return { grade: 'B', gradePoint: 6 };
  if (marks >= 40) return { grade: 'C', gradePoint: 5 };
  if (marks >= 35) return { grade: 'P', gradePoint: 4 };
  return { grade: 'F', gradePoint: 0 };
};
