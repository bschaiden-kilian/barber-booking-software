export function formatDate(isoString: string): string {
  const date = new Date(`${isoString}T00:00:00`);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
}

export function getNextDays(count: number): string[] {
  const days: string[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

export function getDayOfWeekName(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

export function isToday(isoDate: string): boolean {
  const today = new Date();
  const date = new Date(`${isoDate}T00:00:00`);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isTomorrow(isoDate: string): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const date = new Date(`${isoDate}T00:00:00`);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
}
