import {
  Castle,
  Landmark,
  ShieldAlert,
  Trees,
  Crown,
  Flame,
  Building,
  Sparkles,
  Tag,
} from "lucide-react";
import type { Collection } from "@/shared/types/collection";

const ICON_MAP: Record<string, React.ElementType> = {
  Castle,
  Landmark,
  ShieldAlert,
  Trees,
  Crown,
  Flame,
  Building,
  Sparkles,
};

const COLOR_CLASSES: Record<string, string> = {
  amber:
    "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20",
  sky: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30 hover:bg-sky-500/20",
  rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 hover:bg-rose-500/20",
  emerald:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20",
  purple:
    "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 hover:bg-purple-500/20",
};

interface CollectionBadgeProps {
  collection: Collection;
  className?: string;
  size?: "sm" | "md";
}

/**
 * Pure presentation-only badge for displaying a curated collection badge.
 */
export default function CollectionBadge({
  collection,
  className = "",
  size = "sm",
}: CollectionBadgeProps) {
  const Icon = ICON_MAP[collection.icon] || Tag;
  const colorStyle =
    COLOR_CLASSES[collection.badgeColor] || COLOR_CLASSES.amber;

  const sizeStyle =
    size === "sm"
      ? "text-[11px] px-2 py-0.5 gap-1 font-semibold"
      : "text-xs px-2.5 py-1 gap-1.5 font-bold";

  const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

  return (
    <span
      aria-label={`Collection: ${collection.name}`}
      className={`inline-flex items-center rounded-full border transition-all ${colorStyle} ${sizeStyle} ${className}`}
    >
      <Icon className={`${iconSize} shrink-0`} aria-hidden="true" />
      <span className="truncate">{collection.name}</span>
    </span>
  );
}
