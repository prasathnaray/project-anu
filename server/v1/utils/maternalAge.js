const parseMaternalAge = (value) => {
  if (value == null || value === '') return null;
  if (!['number', 'string'].includes(typeof value) || !/^\d+$/.test(String(value).trim())) {
    throw new Error('Maternal age must be a whole number between 1 and 120 years.');
  }
  const age = Number(value);
  if (!Number.isInteger(age) || age < 1 || age > 120) throw new Error('Maternal age must be a whole number between 1 and 120 years.');
  return age;
};
module.exports = { parseMaternalAge };
