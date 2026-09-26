import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatAbsoluteDate(iso: string): string {
  return dayjs(iso).format('MMM D, YYYY');
}

export function formatShortDate(iso: string): string {
  return dayjs(iso).format('MMM D');
}

export function formatRelativeDate(iso: string): string {
  return dayjs(iso).fromNow();
}

export function formatDateTime(iso: string): string {
  return dayjs(iso).format('MMM D, YYYY · HH:mm');
}
