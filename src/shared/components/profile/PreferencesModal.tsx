import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Car, Train, Users, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/shared/hooks/useAuth";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [transport, setTransport] = useState("train");
  const [partySize, setPartySize] = useState(2);

  useEffect(() => {
    if (user?.user_metadata?.preferences) {
      setTransport(user.user_metadata.preferences.transport || "train");
      setPartySize(user.user_metadata.preferences.partySize || 2);
    }
    setSuccess(false);
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await updateUserProfile({
        preferences: {
          transport,
          partySize,
        },
      });

      if (error) {
        console.error("Failed to update preferences", error);
      } else {
        setSuccess(true);
        setTimeout(() => onClose(), 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90dvh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Travel Preferences
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Preferred Transport
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTransport("train")}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    transport === "train"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-200 dark:hover:border-emerald-800"
                  }`}
                >
                  <Train className="w-6 h-6" />
                  <span className="text-sm font-medium">Train / Transit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransport("car")}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    transport === "car"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-200 dark:hover:border-emerald-800"
                  }`}
                >
                  <Car className="w-6 h-6" />
                  <span className="text-sm font-medium">Car Rental</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Number of People (Party Size)
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={partySize}
                  onChange={(e) =>
                    setPartySize(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-xl font-bold shadow-md transition-all duration-300 ${
              success
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : success ? (
              "Preferences Saved!"
            ) : (
              "Save Preferences"
            )}
          </Button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
