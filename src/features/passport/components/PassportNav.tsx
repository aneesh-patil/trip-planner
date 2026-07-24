import { PASSPORT_SECTIONS } from "../constants";
import type { PassportTab } from "../types";

interface PassportNavProps {
  activeTab: PassportTab;
  onSelectTab: (tab: PassportTab) => void;
}

export function PassportNav({ activeTab, onSelectTab }: PassportNavProps) {
  return (
    <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md py-2 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {PASSPORT_SECTIONS.map((section) => {
          const isActive = activeTab === section.id;
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => onSelectTab(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs shrink-0 transition-all ${
                isActive
                  ? "bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-500/30"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
