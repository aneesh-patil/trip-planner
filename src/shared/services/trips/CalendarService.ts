import type { Trip } from "@/shared/types/trip";

export function generateIcsContent(trip: Trip): string {
  const formatIcsDate = (dateStr: string) => {
    return dateStr.replace(/-/g, "") + "T000000Z";
  };

  const getNextDay = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  const start = trip.startDate
    ? formatIcsDate(trip.startDate)
    : formatIcsDate(new Date().toISOString().split("T")[0]);
  const end = trip.endDate
    ? formatIcsDate(getNextDay(trip.endDate))
    : formatIcsDate(
        getNextDay(trip.startDate || new Date().toISOString().split("T")[0]),
      );

  const description = trip.stops
    .map(
      (s, idx) =>
        `${idx + 1}. ${s.name}${s.arrivalTime ? ` (Arrives: ${s.arrivalTime})` : ""}`,
    )
    .join("\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TabiMap//Trip Planner//EN",
    "BEGIN:VEVENT",
    `UID:${trip.id}`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString().split("T")[0])}`,
    `DTSTART;VALUE=DATE:${start.split("T")[0]}`,
    `DTEND;VALUE=DATE:${end.split("T")[0]}`,
    `SUMMARY:${trip.title}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcsFile(trip: Trip): void {
  if (typeof window === "undefined") return;
  const content = generateIcsContent(trip);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `${trip.title.toLowerCase().replace(/\s+/g, "-")}.ics`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
