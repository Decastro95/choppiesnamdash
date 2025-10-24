// src/utils/exportHelpers.ts
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// CSV export
export function exportToCSV(data: any[], filename = "data.csv") {
  if (!data || !data.length) {
    alert("No data to export");
    return;
  }
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));
  for (const row of data) {
    const values = headers.map((h) => JSON.stringify(row[h] ?? ""));
    csvRows.push(values.join(","));
  }
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Excel export
export function exportToExcel(data: any[], filename = "data.xlsx") {
  if (!data || !data.length) {
    alert("No data to export");
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, filename);
}

// PDF export
export function exportToPDF(data: any[], columns: string[], filename: string, title: string) {
  if (!data || !data.length) {
    alert("No data to export");
    return;
  }
  const doc = new jsPDF();
  doc.text(title, 14, 15);
  const rows = data.map((d) => columns.map((col) => d[col]));
  autoTable(doc, { head: [columns], body: rows, startY: 25 });
  doc.save(filename);
}
