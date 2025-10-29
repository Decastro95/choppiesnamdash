// src/components/ExportSection.tsx
import { FileSpreadsheet, FileText, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { exportToExcel, exportToPDF, exportToCSV } from "@/utils/exportUtils";

interface ExportSectionProps {
  role?: string;
  data: any[];
  columns: string[];
  rows: any[][];
  title: string;
}

export default function ExportSection({ role, data, columns, rows, title }: ExportSectionProps) {
  if (role !== "admin" && role !== "manager") return null;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border-2 border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-choppies-red flex items-center gap-2">
          <FileDown className="w-6 h-6" />
          Export Options
        </h2>
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {role}
        </span>
      </div>
      <TooltipProvider>
        <div className="flex flex-wrap gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => exportToExcel(data, `${title}_Export`)}
                className="bg-choppies-green hover:bg-green-700 text-white flex items-center gap-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <FileSpreadsheet size={18} /> Export to Excel
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm">
              Download as Excel file (.xlsx)
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => exportToPDF(columns, rows, `${title}_Report`)}
                className="bg-choppies-red hover:bg-red-700 text-white flex items-center gap-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <FileText size={18} /> Export to PDF
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm">
              Download as PDF file (.pdf)
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => exportToCSV(data, `${title}_Data`)}
                className="bg-gray-700 hover:bg-gray-800 text-white flex items-center gap-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <FileDown size={18} /> Export to CSV
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm">
              Download as CSV file (.csv)
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
