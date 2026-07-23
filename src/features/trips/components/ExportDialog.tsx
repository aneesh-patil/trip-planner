import type { Trip } from "@/shared/types/trip";
import { triggerPdfPrint } from "@/shared/services/trips/PdfExportService";
import {
  downloadIcsFile,
  openGoogleCalendar,
} from "@/shared/services/trips/CalendarService";
import { Button } from "@/shared/components/ui/button";
import { Calendar, FileText, X } from "lucide-react";

interface ExportDialogProps {
  trip: Trip;
  onClose: () => void;
}

export default function ExportDialog({ trip, onClose }: ExportDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full relative shadow-xl mx-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Export Itinerary
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Choose a format to export <strong>{trip.title}</strong>.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => {
              triggerPdfPrint();
              onClose();
            }}
            className="w-full justify-start gap-3 bg-slate-900 hover:bg-slate-850 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-2xl h-12 font-bold"
          >
            <FileText className="w-5 h-5" />
            <span>Print or Save to PDF</span>
          </Button>

          <Button
            onClick={() => {
              openGoogleCalendar(trip);
              onClose();
            }}
            variant="outline"
            className="w-full justify-start gap-3 rounded-2xl h-12 font-bold border-slate-200 dark:border-slate-800"
          >
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Add to Google Calendar</span>
          </Button>

          <Button
            onClick={() => {
              downloadIcsFile(trip);
              onClose();
            }}
            variant="outline"
            className="w-full justify-start gap-3 rounded-2xl h-12 font-bold border-slate-200 dark:border-slate-800"
          >
            <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <span>Export to Calendar (.ics)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
