import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";

interface DestinationFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  maxBudget: number;
  setMaxBudget: (val: number) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
}

export default function DestinationFilters({
  searchQuery,
  setSearchQuery,
  maxBudget,
  setMaxBudget,
  sortBy,
  setSortBy
}: DestinationFiltersProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-8 flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Name, region, tags..."
              className="pl-8 bg-white dark:bg-background"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Sort By</label>
          <Select value={sortBy} onValueChange={(val) => { if (val) setSortBy(val as string); }}>
            <SelectTrigger className="bg-white dark:bg-background">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">Overall Rating</SelectItem>
              <SelectItem value="budget">Lowest Budget</SelectItem>
              <SelectItem value="travelTime">Shortest Travel Time</SelectItem>
              <SelectItem value="walking">Least Walking</SelectItem>
              <SelectItem value="couple">Couple Rating</SelectItem>
              <SelectItem value="summer">Summer Comfort</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Budget Filter */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Max Budget (Recommended)</label>
            <span className="text-sm font-bold text-emerald-600">¥{(maxBudget / 1000).toFixed(0)}k</span>
          </div>
          <Slider
            defaultValue={[80000]}
            max={100000}
            step={5000}
            value={[maxBudget]}
            onValueChange={(val: any) => setMaxBudget(Array.isArray(val) ? val[0] : val)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
