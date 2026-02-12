// validators/scanCenterValidator.js
const validateCreateScanCenter = (req, res, next) => {
    const { center_name, center_email, center_phone, center_address, status } = req.body;
    const errors = [];

    // Validate center_name
    if (!center_name || center_name.trim() === '') {
        errors.push('Center name is required');
    } else if (center_name.length < 3) {
        errors.push('Center name must be at least 3 characters long');
    } else if (center_name.length > 100) {
        errors.push('Center name must not exceed 100 characters');
    }

    // Validate center_email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!center_email || center_email.trim() === '') {
        errors.push('Center email is required');
    } else if (!emailRegex.test(center_email)) {
        errors.push('Center email must be a valid email address');
    }

    // Validate center_phone
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!center_phone || center_phone.trim() === '') {
        errors.push('Center phone is required');
    } else if (!phoneRegex.test(center_phone)) {
        errors.push('Center phone must contain only numbers, spaces, and valid phone characters');
    } else if (center_phone.replace(/[\s\-\+\(\)]/g, '').length < 10) {
        errors.push('Center phone must be at least 10 digits');
    }

    // Validate center_address
    if (!center_address || center_address.trim() === '') {
        errors.push('Center address is required');
    } else if (center_address.length < 10) {
        errors.push('Center address must be at least 10 characters long');
    }

    // Validate status - Match database constraint (case-sensitive)
    const validStatuses = ['Pending', 'Active', 'Inactive']; // Capital first letter
    if (status && !validStatuses.includes(status)) {
        errors.push('Status must be one of: Pending, Active, Inactive');
    }

    // If there are errors, return 400
    if (errors.length > 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: errors
        });
    }

    // Sanitize inputs
    req.body.center_name = center_name.trim();
    req.body.center_email = center_email.trim().toLowerCase();
    req.body.center_phone = center_phone.trim();
    req.body.center_address = center_address.trim();
    
    // Set default status if not provided, keep original case if provided
    req.body.status = status || 'Pending';

    next();
};

module.exports = {
    validateCreateScanCenter
};