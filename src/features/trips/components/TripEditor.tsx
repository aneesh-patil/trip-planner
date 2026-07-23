import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface TripEditorProps {
  initialTitle?: string;
  initialStartDate?: string;
  initialEndDate?: string;
  onSave: (title: string, startDate?: string, endDate?: string) => void;
  onCancel: () => void;
}

export default function TripEditor({
  initialTitle = "",
  initialStartDate = "",
  initialEndDate = "",
  onSave,
  onCancel,
}: TripEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || title.trim() === "") {
      setError("Title is required");
      return;
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date");
      return;
    }
    onSave(title, startDate || undefined, endDate || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
          Trip Title *
        </label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Autumn Getaway to Hakone"
          className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Start Date
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            End Date
          </label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-full font-semibold border-slate-200 dark:border-slate-800"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold px-6"
        >
          Save Trip
        </Button>
      </div>
    </form>
  );
}
