export function formatLocalizedDate(value: string | Date | null | undefined): string {
  if (!value) {
    return '';
  }

  const dateValue = String(value).slice(0, 10);
  const [year, month, day] = dateValue.split('-').map(Number);

  if (!year || !month || !day) {
    return String(value);
  }

  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat(navigator.language, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}