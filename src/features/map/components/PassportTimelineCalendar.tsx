import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTripStore } from "@/shared/hooks/useTripStore";
import destinationsIndex from "@/shared/data/destinations-index.json";
import { formatVisitedDate } from "@/shared/utils/date";
import type { Destination } from "@/shared/types/destination";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Grid,
  List,
  Compass,
  ArrowRight,
  Luggage,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

interface ActivityEvent {
  id: string;
  type: "visited" | "trip";
  title: string;
  dateStr: string; // YYYY-MM-DD, YYYY-MM, or YYYY
  prefecture?: string;
  heroImage?: string;
  destinationId?: string;
  tripId?: string;
  subtitle?: string;
}

export function PassportTimelineCalendar() {
  const { visited, visitedDates, trips } = useTripStore();

  const [viewMode, setViewMode] = useState<"calendar" | "timeline">("calendar");
  const [filterType, setFilterType] = useState<"all" | "visited" | "trips">(
    "all",
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);

  // Parse all activity events
  const allEvents = useMemo(() => {
    const events: ActivityEvent[] = [];

    // Visited destinations
    visited.forEach((vId) => {
      const dest = (destinationsIndex as Destination[]).find(
        (d) => d.id === vId,
      );
      if (dest) {
        const dateStr = visitedDates[vId] || "";
        events.push({
          id: `visited-${vId}`,
          type: "visited",
          title: dest.name,
          dateStr: dateStr,
          prefecture: dest.prefecture,
          heroImage: dest.heroImage,
          destinationId: dest.id,
          subtitle: `${dest.prefecture}, Japan`,
        });
      }
    });

    // Trips
    trips.forEach((trip) => {
      if (trip.startDate) {
        events.push({
          id: `trip-${trip.id}`,
          type: "trip",
          title: trip.title,
          dateStr: trip.startDate,
          subtitle: `${trip.stops.length} stop${trip.stops.length === 1 ? "" : "s"}`,
          tripId: trip.id,
        });
      }
    });

    return events;
  }, [visited, visitedDates, trips]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      if (filterType === "visited") return ev.type === "visited";
      if (filterType === "trips") return ev.type === "trip";
      return true;
    });
  }, [allEvents, filterType]);

  // Calendar month calculations
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Day of week index (0 = Sun, 1 = Mon, etc.)
  const startDayOfWeek = firstDayOfMonth.getDay();
  const totalDaysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDayStr(null);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDayStr(null);
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDayStr(null);
  };

  // Map events by exact date YYYY-MM-DD
  const eventsByExactDate = useMemo(() => {
    const map: Record<string, ActivityEvent[]> = {};
    filteredEvents.forEach((ev) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(ev.dateStr)) {
        if (!map[ev.dateStr]) map[ev.dateStr] = [];
        map[ev.dateStr].push(ev);
      }
    });
    return map;
  }, [filteredEvents]);

  // Events for current month (exact or YYYY-MM)
  const currentMonthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  const currentMonthEvents = useMemo(() => {
    return filteredEvents.filter((ev) => {
      if (!ev.dateStr) return false;
      return ev.dateStr.startsWith(currentMonthKey);
    });
  }, [filteredEvents, currentMonthKey]);

  // Group events for timeline view chronologically
  const timelineGroups = useMemo(() => {
    const groups: Record<string, ActivityEvent[]> = {};

    // Sort events newest first
    const sorted = [...filteredEvents].sort((a, b) => {
      return (b.dateStr || "0000").localeCompare(a.dateStr || "0000");
    });

    sorted.forEach((ev) => {
      let groupKey = "Undated / Memory Log";
      if (/^\d{4}-\d{2}-\d{2}$/.test(ev.dateStr)) {
        const [y, m] = ev.dateStr.split("-");
        const d = new Date(Number(y), Number(m) - 1, 1);
        groupKey = d.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      } else if (/^\d{4}-\d{2}$/.test(ev.dateStr)) {
        const [y, m] = ev.dateStr.split("-");
        const d = new Date(Number(y), Number(m) - 1, 1);
        groupKey = d.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      } else if (/^\d{4}$/.test(ev.dateStr)) {
        groupKey = ev.dateStr;
      }

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(ev);
    });

    return groups;
  }, [filteredEvents]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Activity Timeline & Calendar
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Visual activity log of visited destinations & trip itineraries
            across Japan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Type Pills */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterType === "all"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All ({allEvents.length})
            </button>
            <button
              onClick={() => setFilterType("visited")}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterType === "visited"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Visited ({visited.length})
            </button>
            <button
              onClick={() => setFilterType("trips")}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterType === "trips"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Trips ({trips.length})
            </button>
          </div>

          {/* View Switcher: Calendar vs Timeline */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                viewMode === "calendar"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                viewMode === "timeline"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "calendar" ? (
        <div className="space-y-6">
          {/* Calendar Header Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {monthNames[month]} {year}
              </h3>
              <button
                onClick={goToToday}
                className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/30">
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800 text-center py-2.5">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Cells Grid */}
            <div className="grid grid-cols-7 auto-rows-fr gap-px bg-slate-200 dark:bg-slate-800">
              {/* Empty leading cells */}
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="bg-slate-50/30 dark:bg-slate-900/40 min-h-[72px] sm:min-h-[96px] p-1.5"
                />
              ))}

              {/* Month Day Cells */}
              {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                const dayEvents = eventsByExactDate[dayStr] || [];
                const isToday =
                  dayStr === new Date().toISOString().split("T")[0];
                const isSelected = selectedDayStr === dayStr;

                return (
                  <div
                    key={dayStr}
                    onClick={() =>
                      setSelectedDayStr(isSelected ? null : dayStr)
                    }
                    className={`min-h-[72px] sm:min-h-[96px] p-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-emerald-500/10 border-2 border-emerald-500 dark:bg-emerald-950/40"
                        : isToday
                          ? "bg-emerald-50/80 dark:bg-emerald-950/20"
                          : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-extrabold w-6 h-6 flex items-center justify-center rounded-full ${
                          isToday
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {dayNum}
                      </span>

                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    {/* Event Preview Pills */}
                    <div className="space-y-1 mt-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate flex items-center gap-1 ${
                            ev.type === "visited"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              ev.type === "visited"
                                ? "bg-emerald-500"
                                : "bg-blue-500"
                            }`}
                          />
                          <span className="truncate">{ev.title}</span>
                        </div>
                      ))}

                      {dayEvents.length > 2 && (
                        <div className="text-[9px] font-extrabold text-slate-400 pl-1">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Cards List for Month or Selected Day */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                {selectedDayStr
                  ? `Activities on ${formatVisitedDate(selectedDayStr)}`
                  : `Activities in ${monthNames[month]} ${year}`}
              </h4>

              {selectedDayStr && (
                <button
                  onClick={() => setSelectedDayStr(null)}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Show Full Month
                </button>
              )}
            </div>

            {(() => {
              const displayList = selectedDayStr
                ? eventsByExactDate[selectedDayStr] || []
                : currentMonthEvents;

              if (displayList.length === 0) {
                return (
                  <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <CalendarIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      No activity recorded for this period
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Mark destinations as visited or add trips to populate your
                      calendar.
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {displayList.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center gap-3 p-3 rounded-2xl border bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 shadow-sm"
                    >
                      {ev.heroImage ? (
                        <img
                          src={ev.heroImage}
                          alt={ev.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <Luggage className="w-6 h-6" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Badge
                            className={`text-[10px] px-2 py-0 border-none ${
                              ev.type === "visited"
                                ? "bg-emerald-500 text-white"
                                : "bg-blue-500 text-white"
                            }`}
                          >
                            {ev.type === "visited" ? "Visited" : "Trip"}
                          </Badge>
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                            {formatVisitedDate(ev.dateStr)}
                          </span>
                        </div>

                        <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {ev.title}
                        </div>

                        {ev.subtitle && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {ev.subtitle}
                          </div>
                        )}
                      </div>

                      {ev.destinationId && (
                        <Link
                          to={`/destinations/${ev.destinationId}`}
                          className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0"
                          title="View Details"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      ) : (
        /* Timeline View Stream */
        <div className="space-y-8">
          {Object.keys(timelineGroups).length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <Compass className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No activity entries found
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Start marking visited destinations or planning itineraries to
                build your timeline!
              </p>
            </div>
          ) : (
            Object.entries(timelineGroups).map(([groupTitle, groupEvents]) => (
              <div key={groupTitle} className="space-y-4">
                {/* Timeline Month/Year Divider Header */}
                <div className="flex items-center gap-3">
                  <div className="text-base font-extrabold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/60 shadow-sm">
                    {groupTitle}
                  </div>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                </div>

                {/* Timeline Event Items Stream */}
                <div className="relative pl-6 border-l-2 border-emerald-500/30 space-y-4 ml-4">
                  {groupEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm group"
                    >
                      {/* Timeline Dot Indicator */}
                      <div
                        className={`absolute -left-[31px] top-6 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                          ev.type === "visited"
                            ? "bg-emerald-500 shadow-emerald-500/50 shadow-sm"
                            : "bg-blue-500 shadow-blue-500/50 shadow-sm"
                        }`}
                      />

                      <div className="flex items-center gap-3.5 min-w-0">
                        {ev.heroImage ? (
                          <img
                            src={ev.heroImage}
                            alt={ev.title}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-sm">
                            <Luggage className="w-7 h-7" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              className={`text-[10px] px-2 py-0 border-none ${
                                ev.type === "visited"
                                  ? "bg-emerald-500 text-white"
                                  : "bg-blue-500 text-white"
                              }`}
                            >
                              {ev.type === "visited"
                                ? "Visited Sight"
                                : "Itinerary Trip"}
                            </Badge>
                            {ev.prefecture && (
                              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-emerald-500" />
                                {ev.prefecture}
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
                            {ev.title}
                          </h4>

                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {formatVisitedDate(ev.dateStr)}
                            {ev.subtitle ? ` • ${ev.subtitle}` : ""}
                          </p>
                        </div>
                      </div>

                      {ev.destinationId && (
                        <Link
                          to={`/destinations/${ev.destinationId}`}
                          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-700/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors shadow-sm self-end sm:self-auto shrink-0"
                        >
                          View Details
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
