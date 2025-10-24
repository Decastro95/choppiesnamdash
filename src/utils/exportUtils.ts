// src/utils/exportUtils.ts
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";

// ✅ Excel Export
export const exportToExcel = (data: any[], fileName = "export") => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

// ✅ PDF Export
export const exportToPDF = (columns: string[], rows: any[][], fileName = "report") => {
  const doc = new jsPDF();
  doc.text(fileName, 14, 10);
  (doc as any).autoTable({
    head: [columns],
    body: rows,
  });
  doc.save(`${fileName}.pdf`);
};

// ✅ CSV Export
export const exportToCSV = (data: any[], fileName = "export") => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.csv`;
  link.click();
};
