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
    <div className="bg-white shadow-md rounded-2xl p-4 mt-4 border border-gray-100">
      <h2 className="text-lg font-semibold mb-3 text-red-700">
        📦 Export Options ({role?.toUpperCase()})
      </h2>
      <TooltipProvider>
        <div className="flex gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => exportToExcel(data, `${title}_Export`)}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 rounded-xl"
              >
                <FileSpreadsheet size={18} /> Excel
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download as Excel file (.xlsx)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => exportToPDF(columns, rows, `${title}_Report`)}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 rounded-xl"
              >
                <FileText size={18} /> PDF
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download as PDF file (.pdf)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => exportToCSV(data, `${title}_Data`)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 rounded-xl"
              >
                <FileDown size={18} /> CSV
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download as CSV file (.csv)</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
