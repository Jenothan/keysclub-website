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
      badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300 font-bold'
    };
  }

  const rawStatus = booking.status || 'Pending';

  if (rawStatus === 'Pending') {
    return {
      status: 'Pending',
      label: 'Pending Admin',
      badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold'
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

      const startDateTime = parseTimeStrToDate(bookingDateStr, booking.start_time);
      const endDateTime = parseTimeStrToDate(bookingDateStr, booking.end_time);

      if (now >= startDateTime && now <= endDateTime) {
        return {
          status: 'Ongoing',
          label: 'Ongoing Now ⚡',
          badgeClass: 'bg-blue-600 text-white font-black animate-pulse shadow-xs tracking-wider'
        };
      } else if (now > endDateTime) {
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
