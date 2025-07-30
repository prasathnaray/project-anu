function NameValidation(name){
    const namePattern = /^[a-zA-Z\s'-]+$/;
    return namePattern.test(name);
}
export default NameValidation;