function PhoneValidation(phoneNumber){
     const phoneRegex = /^(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})$/; 
     return phoneRegex.test(phoneNumber);
}
export default PhoneValidation;