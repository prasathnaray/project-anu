const generateBatchID = () => {
  const now = new Date();
  const monthAbbr = now.toLocaleString('en-US', { month: 'short' }).toUpperCase(); // "JUL"
  const year = now.getFullYear().toString().slice(-2); // "25"
  return `BTH${monthAbbr}${year}`;
}
module.exports = {generateBatchID}