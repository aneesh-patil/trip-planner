import { useState, useEffect } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import {
  Sliders,
  MapPin,
  Car,
  Sun,
  Eye,
  Download,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type SettingsSection =
  "general" | "travel" | "appearance" | "accessibility" | "data";

export default function Settings() {
  const { user, updateUserProfile } = useAuth();
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("general");
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings State
  const [baseLocation, setBaseLocation] = useState(
    user?.user_metadata?.base_location || "Tokyo Station",
  );
  const [units, setUnits] = useState(user?.user_metadata?.units || "metric");
  const [carMode, setCarMode] = useState(
    user?.user_metadata?.preferences?.carMode || "none",
  );
  const [publicModes, setPublicModes] = useState<string[]>(
    user?.user_metadata?.preferences?.publicModes || ["train"],
  );
  const [partySize, setPartySize] = useState(
    user?.user_metadata?.preferences?.partySize || 2,
  );
  const [themeMode, setThemeMode] = useState(
    user?.user_metadata?.theme || "system",
  );
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (user?.user_metadata) {
      setBaseLocation(user.user_metadata.base_location || "Tokyo Station");
      setUnits(user.user_metadata.units || "metric");
      if (user.user_metadata.preferences) {
        setCarMode(user.user_metadata.preferences.carMode || "none");
        setPublicModes(user.user_metadata.preferences.publicModes || ["train"]);
        setPartySize(user.user_metadata.preferences.partySize || 2);
      }
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);

    try {
      const { error } = await updateUserProfile({
        base_location: baseLocation,
        units,
        theme: themeMode,
        preferences: {
          carMode,
          publicModes,
          partySize,
          preferences_set: true,
        },
      });

      if (!error) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePublicMode = (mode: string) => {
    setPublicModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode],
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
          <Sliders className="w-4 h-4" />
          Application Configuration
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Settings & Preferences
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your Base Location, travel preferences, transport defaults,
          and UI accessibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1">
          {[
            {
              id: "general",
              label: "⚙️ General & Base Location",
              icon: MapPin,
            },
            { id: "travel", label: "🚘 Travel Preferences", icon: Car },
            { id: "appearance", label: "🎨 Appearance", icon: Sun },
            { id: "accessibility", label: "👁️ Accessibility", icon: Eye },
            { id: "data", label: "💾 Data & Export", icon: Download },
          ].map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as SettingsSection)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Settings Form Panel */}
        <div className="lg:col-span-9">
          <form
            onSubmit={handleSave}
            className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6"
          >
            {saveSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Settings updated
                successfully!
              </div>
            )}

            {/* Section 1: General & Base Location */}
            {activeSection === "general" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    General & Base Location
                  </h3>
                  <p className="text-xs text-slate-500">
                    Set your home starting point for travel duration estimates
                    and regional route calculations.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Base Location (Home Station / Prefecture)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <input
                        type="text"
                        value={baseLocation}
                        onChange={(e) => setBaseLocation(e.target.value)}
                        placeholder="e.g. Tokyo Station, Shinjuku, Osaka Station"
                        className="w-full pl-10 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Used to calculate estimated transit hours when planning
                      custom itineraries.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Measurement Units
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "metric", label: "Metric (km, m)" },
                        { id: "imperial", label: "Imperial (mi, ft)" },
                      ].map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => setUnits(u.id)}
                          className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
                            units === u.id
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {u.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Travel Preferences */}
            {activeSection === "travel" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Travel & Transit Preferences
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure default transit modes and party size for trip
                    generation.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      Car Mode Preference
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "none", label: "🚫 Transit Only" },
                        { id: "rental", label: "🚗 Rental Car" },
                        { id: "own", label: "🚘 Personal Car" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setCarMode(m.id)}
                          className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
                            carMode === m.id
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      Public Transport Modes
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "train", label: "🚆 Train / Subway" },
                        { id: "bus", label: "🚌 Local Bus" },
                        { id: "express", label: "🚄 Shinkansen" },
                      ].map((tm) => (
                        <button
                          key={tm.id}
                          type="button"
                          onClick={() => togglePublicMode(tm.id)}
                          className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
                            publicModes.includes(tm.id)
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {tm.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                      Default Travel Party Size: {partySize} person
                      {partySize > 1 ? "s" : ""}
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={partySize}
                      onChange={(e) => setPartySize(parseInt(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Appearance */}
            {activeSection === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Appearance & Theme
                  </h3>
                  <p className="text-xs text-slate-500">
                    Customize interface visual theme and contrast preferences.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { id: "system", label: "💻 System Default" },
                    { id: "light", label: "☀️ Light Mode" },
                    { id: "dark", label: "🌙 Dark Mode" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setThemeMode(t.id)}
                      className={`p-4 rounded-2xl text-xs font-bold border transition-all text-center ${
                        themeMode === t.id
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Accessibility */}
            {activeSection === "accessibility" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Accessibility Options
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure motion and visual contrast preferences.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Reduced Motion
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Minimize animations and UI transition effects
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Section 5: Data & Export */}
            {activeSection === "data" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Data & Export Controls
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage your stored travel history data.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Export Travel History
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Download a JSON backup of your visited destinations and
                    saved itineraries.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const dataStr =
                        "data:text/json;charset=utf-8," +
                        encodeURIComponent(
                          JSON.stringify(user?.user_metadata || {}),
                        );
                      const downloadAnchor = document.createElement("a");
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute(
                        "download",
                        "tabimap_user_data.json",
                      );
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="rounded-xl text-xs font-bold flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Data (JSON)
                  </Button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Settings
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
