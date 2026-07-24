import type { SearchGroup, SearchDocument } from "./types";
import { ArrowRight, CornerDownLeft } from "lucide-react";

interface SearchResultsProps {
  groups: SearchGroup[];
  flatItems: SearchDocument[];
  selectedIndex: number;
  onSelect: (item: SearchDocument) => void;
  onHoverIndex: (index: number) => void;
}

export function SearchResults({
  groups,
  flatItems,
  selectedIndex,
  onSelect,
  onHoverIndex,
}: SearchResultsProps) {
  if (flatItems.length === 0) {
    return (
      <div className="py-12 text-center space-y-2">
        <p className="text-sm font-bold text-slate-800 dark:text-white">
          No matching results found
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          Try searching for a prefecture (e.g., "Kyoto"), sight ("Himeji"), or
          collection ("UNESCO").
        </p>
      </div>
    );
  }

  let cumulativeIndex = 0;

  return (
    <div className="py-2 space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
      {groups.map((group) => {
        const groupStartIndex = cumulativeIndex;
        cumulativeIndex += group.items.length;

        return (
          <div key={group.type} className="space-y-1.5">
            <div className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {group.label}
            </div>

            <div className="space-y-1">
              {group.items.map((item, itemIdx) => {
                const globalIndex = groupStartIndex + itemIdx;
                const isSelected = globalIndex === selectedIndex;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item)}
                    onMouseEnter={() => onHoverIndex(globalIndex)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left group ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 shadow-sm"
                        : "hover:bg-slate-100/80 dark:hover:bg-slate-800/60 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {Icon && (
                        <div
                          className={`p-2 rounded-xl shrink-0 transition-transform ${
                            isSelected
                              ? "bg-emerald-600 text-white scale-105"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:scale-105"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-bold truncate ${
                            isSelected
                              ? "text-emerald-950 dark:text-emerald-300"
                              : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {item.badge && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                          {item.badge}
                        </span>
                      )}
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
