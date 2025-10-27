const generateBatchID = (centerCode, batchCount = 1, date = new Date()) => {
  // const now = new Date();
  // const monthAbbr = now.toLocaleString('en-US', { month: 'short' }).toUpperCase(); // "JUL"
  // const year = now.getFullYear().toString().slice(-2); // "25"
  // return `BTH${monthAbbr}${year}`;
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  const year = date.getFullYear().toString().slice(-2);
  const serial = batchCount.toString().padStart(3, '0'); // 001, 002, ...
  
  return `BTH${month}${year}-${centerCode.toUpperCase()}-${serial}`;
}
module.exports = {generateBatchID}