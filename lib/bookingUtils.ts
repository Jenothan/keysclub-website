import { format } from 'date-fns';

export interface ComputedStatus {
  status: 'Pending' | 'Confirmed' | 'Ongoing' | 'Completed' | 'Rejected' | 'Cancelled';
  label: string;
  badgeClass: string;
}

export function computeBookingStatus(booking: any): ComputedStatus {
  if (!booking) {
    return {
      status: 'Pending',
      label: 'Pending',
      badgeClass: 'bg-yellow-400 text-slate-900 border border-yellow-500 font-black shadow-2xs'
    };
  }

  const rawStatus = booking.status || 'Pending';

  if (rawStatus === 'Pending') {
    return {
      status: 'Pending',
      label: 'Pending Admin',
      badgeClass: 'bg-yellow-400 text-slate-900 border border-yellow-500 font-black shadow-2xs'
    };
  }
  if (rawStatus === 'Rejected') {
    return {
      status: 'Rejected',
      label: 'Rejected',
      badgeClass: 'bg-red-100 text-red-700 border border-red-200 font-bold'
    };
  }
  if (rawStatus === 'Cancelled') {
    return {
      status: 'Cancelled',
      label: 'Cancelled',
      badgeClass: 'bg-slate-100 text-slate-600 border border-slate-200 font-medium'
    };
  }
  if (rawStatus === 'Completed') {
    return {
      status: 'Completed',
      label: 'Completed',
      badgeClass: 'bg-purple-100 text-purple-800 border border-purple-200 font-extrabold'
    };
  }

  // If status === 'Confirmed', evaluate real-time ongoing vs completed status based on slot times
  if (rawStatus === 'Confirmed') {
    try {
      const now = new Date();

      let bookingDateStr = booking.booking_date;
      if (typeof bookingDateStr === 'string' && bookingDateStr.includes('T')) {
        bookingDateStr = bookingDateStr.split('T')[0];
      }

      const parseTimeStrToDate = (dateStr: string, timeStr: string) => {
        if (!dateStr || !timeStr) return new Date();
        const [year, month, day] = dateStr.split('-').map(Number);
        let hours = 0;
        let minutes = 0;

        if (timeStr.toLowerCase().includes('pm') || timeStr.toLowerCase().includes('am')) {
          const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (match) {
            hours = parseInt(match[1], 10);
            minutes = parseInt(match[2], 10);
            const isPM = match[3].toUpperCase() === 'PM';
            if (isPM && hours < 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;
          }
        } else {
          const parts = timeStr.split(':').map(Number);
          hours = parts[0] || 0;
          minutes = parts[1] || 0;
        }

        return new Date(year, month - 1, day, hours, minutes, 0);
      };

      const slotsToCheck = Array.isArray(booking.slots) && booking.slots.length > 0 
        ? booking.slots 
        : [{ start_time: booking.start_time, end_time: booking.end_time }];

      let isAnyOngoing = false;
      let isAllCompleted = true;

      for (const slot of slotsToCheck) {
        const startDateTime = parseTimeStrToDate(bookingDateStr, slot.start_time);
        const endDateTime = parseTimeStrToDate(bookingDateStr, slot.end_time);

        if (now >= startDateTime && now <= endDateTime) {
          isAnyOngoing = true;
        }
        if (now <= endDateTime) {
          isAllCompleted = false;
        }
      }

      if (isAnyOngoing) {
        return {
          status: 'Ongoing',
          label: 'Ongoing Now ⚡',
          badgeClass: 'bg-blue-600 text-white font-black animate-pulse shadow-xs tracking-wider'
        };
      } else if (isAllCompleted) {
        return {
          status: 'Completed',
          label: 'Completed',
          badgeClass: 'bg-purple-100 text-purple-800 border border-purple-200 font-extrabold'
        };
      } else {
        return {
          status: 'Confirmed',
          label: 'Confirmed',
          badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold'
        };
      }
    } catch (e) {
      console.error('Failed to compute dynamic booking status', e);
    }
  }

  return {
    status: 'Confirmed',
    label: 'Confirmed',
    badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold'
  };
}

export function getSlotHours(startStr: string, endStr: string): number {
  if (!startStr || !endStr) return 1;
  const [h1, m1] = startStr.split(':').map(Number);
  const [h2, m2] = endStr.split(':').map(Number);
  const startMins = (h1 || 0) * 60 + (m1 || 0);
  const endMins = (h2 || 0) * 60 + (m2 || 0);
  const diffMins = endMins - startMins;
  return diffMins > 0 ? Math.round(diffMins / 60) : 1;
}

export interface GroupedBooking {
  id: number;
  booking_reference: string;
  booking_date: string;
  court_id: number;
  court?: any;
  user_id?: number | null;
  user?: any;
  customer_name?: string;
  customer_phone?: string;
  notes?: string;
  status: string;
  booked_by_id?: number;
  booked_by?: any;
  confirmed_by?: any;
  rejected_by?: any;
  cancelled_by?: any;
  rescheduled_by?: any;
  created_at?: string;
  total_slots_count: number;
  slots: {
    id: number;
    start_time: string;
    end_time: string;
    status: string;
  }[];
  start_time: string;
  end_time: string;
  time_display: string;
  time_ranges: string[];
  rawBookings: any[];
}

export function groupBookings(rawBookings: any[]): GroupedBooking[] {
  if (!rawBookings || !Array.isArray(rawBookings) || rawBookings.length === 0) {
    return [];
  }

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const d = new Date();
    d.setHours(parseInt(h, 10), parseInt(m, 10));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const map = new Map<string, any[]>();

  for (const b of rawBookings) {
    // Unique key: booking_reference if present, else fallback key
    let refKey = b.booking_reference ? b.booking_reference.trim() : '';
    if (!refKey || refKey === '#KC-') {
      refKey = `LEGACY_${b.booking_date}_${b.user_id || b.customer_phone || 'guest'}_${b.created_at || b.id}`;
    }

    if (!map.has(refKey)) {
      map.set(refKey, []);
    }
    map.get(refKey)!.push(b);
  }

  const result: GroupedBooking[] = [];

  map.forEach((items, key) => {
    // Sort items by start_time
    items.sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));

    const primary = items[0];
    const refCode = primary.booking_reference && primary.booking_reference !== '#KC-' 
      ? (primary.booking_reference.startsWith('#') ? primary.booking_reference : `#${primary.booking_reference}`)
      : `#KC-${primary.id}`;

    // Merge contiguous slots for clean badge display
    const merged: { start_time: string; end_time: string }[] = [];
    for (const s of items) {
      if (merged.length === 0) {
        merged.push({ start_time: s.start_time, end_time: s.end_time });
      } else {
        const last = merged[merged.length - 1];
        if (last.end_time === s.start_time) {
          last.end_time = s.end_time;
        } else {
          merged.push({ start_time: s.start_time, end_time: s.end_time });
        }
      }
    }

    const timeRanges = merged.map(m => `${formatTime(m.start_time)} - ${formatTime(m.end_time)}`);
    const timeDisplay = timeRanges.join(', ');

    // Calculate actual total individual slots count (e.g. 13:00-15:00 is 2 slots)
    const totalSlotsCount = items.reduce((sum, item) => sum + getSlotHours(item.start_time, item.end_time), 0);

    const confirmedByAdmin = primary.confirmed_by_user || primary.confirmed_by || items.find(i => i.confirmed_by_user || i.confirmed_by)?.confirmed_by_user || items.find(i => i.confirmed_by)?.confirmed_by;
    const rejectedByAdmin = primary.rejected_by_user || primary.rejected_by || items.find(i => i.rejected_by_user || i.rejected_by)?.rejected_by_user || items.find(i => i.rejected_by)?.rejected_by;
    const cancelledByAdmin = primary.cancelled_by_user || primary.cancelled_by || items.find(i => i.cancelled_by_user || i.cancelled_by)?.cancelled_by_user || items.find(i => i.cancelled_by)?.cancelled_by;
    const rescheduledByAdmin = primary.rescheduled_by_user || primary.rescheduled_by || items.find(i => i.rescheduled_by_user || i.rescheduled_by)?.rescheduled_by_user || items.find(i => i.rescheduled_by)?.rescheduled_by;

    result.push({
      id: primary.id,
      booking_reference: refCode,
      booking_date: primary.booking_date,
      court_id: primary.court_id,
      court: primary.court,
      user_id: primary.user_id,
      user: primary.user,
      customer_name: primary.customer_name,
      customer_phone: primary.customer_phone,
      notes: primary.notes || items.find(i => i.notes)?.notes,
      status: primary.status,
      booked_by_id: primary.booked_by_id,
      booked_by: primary.booked_by,
      confirmed_by: confirmedByAdmin,
      rejected_by: rejectedByAdmin,
      cancelled_by: cancelledByAdmin,
      rescheduled_by: rescheduledByAdmin,
      created_at: primary.created_at,
      total_slots_count: totalSlotsCount,
      slots: items.map(s => ({
        id: s.id,
        start_time: s.start_time,
        end_time: s.end_time,
        status: s.status,
      })),
      start_time: primary.start_time,
      end_time: items[items.length - 1].end_time,
      time_display: timeDisplay,
      time_ranges: timeRanges,
      rawBookings: items,
    });
  });

  return result;
}
