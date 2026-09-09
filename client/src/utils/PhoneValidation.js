function PhoneValidation(phoneNumber){
     if (!phoneNumber) return false;
     const cleaned = String(phoneNumber).replace(/^\+91\s?/, '');
     const phoneRegex = /^(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})$/; 
     return phoneRegex.test(cleaned) || phoneRegex.test(phoneNumber);
}
export default PhoneValidation;