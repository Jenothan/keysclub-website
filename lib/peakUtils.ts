import { format } from 'date-fns';

export interface PeakConfig {
  peak_start_time: string; // e.g. "15:00:00"
  peak_end_time: string;   // e.g. "20:00:00"
  peak_off_days: string[]; // e.g. ["Saturday", "Sunday"]
}

export const DEFAULT_PEAK_CONFIG: PeakConfig = {
  peak_start_time: "15:00:00",
  peak_end_time: "20:00:00",
  peak_off_days: ["Saturday", "Sunday"],
};

export const ALL_DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function isPeakDay(date: Date | undefined, peakOffDays: string[] = DEFAULT_PEAK_CONFIG.peak_off_days): boolean {
  if (!date) return true;
  const dayName = format(date, 'EEEE'); // e.g. "Monday"
  return !peakOffDays.includes(dayName);
}

export function isPeakSlot(
  startTime: string, // e.g. "15:00:00"
  endTime: string,   // e.g. "16:00:00"
  date: Date | undefined,
  config: PeakConfig = DEFAULT_PEAK_CONFIG
): boolean {
  if (!isPeakDay(date, config.peak_off_days)) {
    return false;
  }
  const peakStart = config.peak_start_time || "15:00:00";
  const peakEnd = config.peak_end_time || "20:00:00";

  return startTime < peakEnd && endTime > peakStart;
}

export function formatTime24to12(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  let h = parseInt(parts[0], 10);
  const m = parts[1] || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
}
