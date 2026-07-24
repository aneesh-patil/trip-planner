import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Calendar as CalendarIcon, CheckCircle2, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface VisitedDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: {
    id: string;
    name: string;
  };
  onConfirm: (date: string) => void;
  initialDate?: string;
}

export function VisitedDateModal({
  isOpen,
  onClose,
  destination,
  onConfirm,
  initialDate,
}: VisitedDateModalProps) {
  const getTodayStr = () => new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate || getTodayStr(),
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(initialDate || getTodayStr());
    }
  }, [isOpen, initialDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    onConfirm(selectedDate);
    onClose();
  };

  const setPresetDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all animate-in zoom-in-95 duration-200 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="visited-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2
              id="visited-modal-title"
              className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Mark as Visited
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-xs sm:max-w-md">
              When did you visit{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {destination.name}
              </span>
              ?
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              Date Visited
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                max={getTodayStr()}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <CalendarIcon className="w-5 h-5 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Quick Presets
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPresetDate(0)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedDate === getTodayStr()
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setPresetDate(1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-transparent hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Yesterday
              </button>
              <button
                type="button"
                onClick={() => setPresetDate(7)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-transparent hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                1 Week Ago
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold px-5"
            >
              Save Visit Date
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
