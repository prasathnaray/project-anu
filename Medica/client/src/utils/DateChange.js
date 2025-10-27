function getMonthYear(isoString){
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
export default getMonthYear;