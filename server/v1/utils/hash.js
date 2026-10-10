let bcrypt;
try {
  // Try native bcrypt first (for desktop/server environments)
  bcrypt = require('bcrypt');
} catch (err) {
  console.warn('⚠️ Native bcrypt not available. Falling back to bcryptjs.');
  bcrypt = require('bcryptjs');
}
const HashPassword = async(plainPassword) =>{
    const saltRounds = 10;
    const hashed = await bcrypt.hash(plainPassword, saltRounds);
    //console.log(hashed);
    return hashed;
}
async function comparePasswords(enteredPassword, hashedPasswordFromDB) {
    const match = await bcrypt.compare(enteredPassword, hashedPasswordFromDB);
    return match;
} 
module.exports = {comparePasswords, HashPassword};
