export type ScheduleEntry = {
  id: string;
  eventName: string;
  status: string | null;
  venue: string | null;
  summary: string;
  day: number | null;
  sortIndex: number | null;
  timeSlot: string | null;
  isStructured: boolean;
};

export function sortScheduleEntries(entries: ScheduleEntry[]) {
  return [...entries].sort((left, right) => {
    const leftDay = left.day ?? Number.MAX_SAFE_INTEGER;
    const rightDay = right.day ?? Number.MAX_SAFE_INTEGER;

    if (leftDay !== rightDay) {
      return leftDay - rightDay;
    }

    const leftSort = left.sortIndex ?? Number.MAX_SAFE_INTEGER;
    const rightSort = right.sortIndex ?? Number.MAX_SAFE_INTEGER;

    if (leftSort !== rightSort) {
      return leftSort - rightSort;
    }

    return left.eventName.localeCompare(right.eventName);
  });
}

export function formatScheduleSummary(day: number | null, timeSlot: string | null, fallback: string) {
  if (!timeSlot) return fallback;
  if (!day) return timeSlot;

  return `Day ${day} · ${timeSlot}`;
}
