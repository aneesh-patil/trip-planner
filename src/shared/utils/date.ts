export function formatVisitedDate(dateStr?: string): string {
  if (!dateStr) return "";

  // YYYY-MM-DD (e.g. 2026-07-24)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split("-");
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // YYYY-MM (e.g. 2026-07)
  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    const [year, month] = dateStr.split("-");
    const d = new Date(Number(year), Number(month) - 1, 1);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  }

  // YYYY (e.g. 2026)
  if (/^\d{4}$/.test(dateStr)) {
    return dateStr;
  }

  return dateStr;
}
