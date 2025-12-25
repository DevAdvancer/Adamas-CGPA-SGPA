import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SemesterHistoryEntry } from '@/types/calculator';

export function exportToCSV(history: SemesterHistoryEntry[]): void {
  const headers = ['Date & Time', 'Type', 'Result', 'Details'];
  const rows = history.map(entry => [
    entry.date,
    entry.type,
    entry.type === 'Percentage' ? `${entry.result.toFixed(2)}%` : entry.result.toFixed(2),
    entry.details,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `adamas-calculator-history-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPDF(history: SemesterHistoryEntry[]): void {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setTextColor(30, 58, 95); // Navy blue
  doc.text('Adamas University', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('SGPA-CGPA Calculator History', 105, 30, { align: 'center' });

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 105, 40, { align: 'center' });

  // Table
  const tableData = history.map(entry => [
    entry.date,
    entry.type,
    entry.type === 'Percentage' ? `${entry.result.toFixed(2)}%` : entry.result.toFixed(2),
    entry.details,
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['Date & Time', 'Type', 'Result', 'Details']],
    body: tableData,
    headStyles: {
      fillColor: [30, 58, 95],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 245, 250],
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 'auto' },
    },
  });

  doc.save(`adamas-calculator-history-${new Date().toISOString().split('T')[0]}.pdf`);
}
