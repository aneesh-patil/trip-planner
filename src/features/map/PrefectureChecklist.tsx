import { useTripStore } from "@/shared/hooks/useTripStore";
import Japan from "@react-map/japan";
import { CheckSquare } from "lucide-react";

const REGIONS = [
  {
    name: "Hokkaido",
    prefectures: [{ id: "Hokkaido\x8D", name: "Hokkaido" }],
  },
  {
    name: "Tohoku",
    prefectures: [
      { id: "Aomori", name: "Aomori" },
      { id: "Iwate", name: "Iwate" },
      { id: "Miyagi", name: "Miyagi" },
      { id: "Akita", name: "Akita" },
      { id: "Yamagata", name: "Yamagata" },
      { id: "Fukushima", name: "Fukushima" },
    ],
  },
  {
    name: "Kanto",
    prefectures: [
      { id: "Ibaraki", name: "Ibaraki" },
      { id: "Tochigi", name: "Tochigi" },
      { id: "Gunma", name: "Gunma" },
      { id: "Saitama", name: "Saitama" },
      { id: "Chiba", name: "Chiba" },
      { id: "Tokyo", name: "Tokyo" },
      { id: "Kanagawa", name: "Kanagawa" },
    ],
  },
  {
    name: "Chubu",
    prefectures: [
      { id: "Niigata", name: "Niigata" },
      { id: "Toyama", name: "Toyama" },
      { id: "Ishikawa", name: "Ishikawa" },
      { id: "Fukui", name: "Fukui" },
      { id: "Yamanashi", name: "Yamanashi" },
      { id: "Nagano", name: "Nagano" },
      { id: "Gifu", name: "Gifu" },
      { id: "Shizuoka", name: "Shizuoka" },
      { id: "Aichi", name: "Aichi" },
    ],
  },
  {
    name: "Kansai",
    prefectures: [
      { id: "Mie", name: "Mie" },
      { id: "Shiga", name: "Shiga" },
      { id: "Kyoto", name: "Kyoto" },
      { id: "Osaka", name: "Osaka" },
      { id: "Hyogo", name: "Hyogo" },
      { id: "Nara", name: "Nara" },
      { id: "Wakayama", name: "Wakayama" },
    ],
  },
  {
    name: "Chugoku",
    prefectures: [
      { id: "Tottori", name: "Tottori" },
      { id: "Shimane", name: "Shimane" },
      { id: "Okayama", name: "Okayama" },
      { id: "Hiroshima", name: "Hiroshima" },
      { id: "Yamaguchi", name: "Yamaguchi" },
    ],
  },
  {
    name: "Shikoku",
    prefectures: [
      { id: "Tokushima", name: "Tokushima" },
      { id: "Kagawa", name: "Kagawa" },
      { id: "Ehime", name: "Ehime" },
      { id: "Kochi", name: "Kochi" },
    ],
  },
  {
    name: "Kyushu & Okinawa",
    prefectures: [
      { id: "Fukuoka", name: "Fukuoka" },
      { id: "Saga", name: "Saga" },
      { id: "Nagasaki", name: "Nagasaki" },
      { id: "Kumamoto", name: "Kumamoto" },
      { id: "Oita", name: "Oita" },
      { id: "Miyazaki", name: "Miyazaki" },
      { id: "Kagoshima", name: "Kagoshima" },
      { id: "Okinawa", name: "Okinawa" },
    ],
  },
];

export default function PrefectureChecklist() {
  const { visitedPrefectures, toggleVisitedPrefecture, isPrefectureVisited } =
    useTripStore();

  const cityColors = visitedPrefectures.reduce(
    (acc, pref) => {
      acc[pref] = "#10b981"; // emerald-500
      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <CheckSquare className="w-8 h-8 text-emerald-600" />
          Prefecture Checklist
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          Track which of the 47 Japanese prefectures you've visited. Watch the
          map light up as you conquer Japan!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Side: Checklist */}
        <div className="space-y-8 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 lg:h-[calc(100vh-12rem)] overflow-y-auto">
          {REGIONS.map((region) => (
            <div key={region.name} className="mb-6 last:mb-0">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                {region.name}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {region.prefectures.map((pref) => {
                  const checked = isPrefectureVisited(pref.id);
                  return (
                    <label
                      key={pref.id}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:-translate-y-0.5 ${
                        checked
                          ? "bg-emerald-50 border-emerald-200 shadow-sm dark:bg-emerald-900/20 dark:border-emerald-800"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700/80"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleVisitedPrefecture(pref.id)}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                      />
                      <span
                        className={`ml-3 text-sm font-bold ${
                          checked
                            ? "text-emerald-700 dark:text-emerald-400"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {pref.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Map */}
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[500px] lg:sticky lg:top-24">
          <div className="w-full h-full flex flex-col items-center">
            <div className="mb-4 text-center">
              <div className="text-5xl font-black text-emerald-600 mb-1">
                {visitedPrefectures.length}{" "}
                <span className="text-3xl text-slate-400">/ 47</span>
              </div>
              <div className="text-sm font-bold uppercase tracking-widest text-slate-500">
                Prefectures Visited
              </div>
            </div>

            <div className="w-full max-w-[600px] aspect-square flex items-center justify-center">
              <Japan
                type="select-multiple"
                size={550}
                mapColor="#cbd5e1"
                strokeColor="#ffffff"
                strokeWidth={1.5}
                hoverColor="#34d399"
                selectColor="#10b981"
                cityColors={cityColors}
                onSelect={(state) => {
                  if (state) toggleVisitedPrefecture(state);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
