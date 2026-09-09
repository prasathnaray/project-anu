function getMonthYear(isoString){
  if (!isoString) return '—';
  const parsed = typeof isoString === 'string' ? isoString.trim().replace(' ', 'T') : isoString;
  const date = new Date(parsed);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
export default getMonthYear;