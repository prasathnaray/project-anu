const ROLES = Object.freeze({
    SUPER_ADMIN: 99,
    INSTITUTION_ADMIN: 101,
    TUTOR: 102,
    TRAINEE: 103
});

const COURSE_EDITOR_ROLES = Object.freeze([
    ROLES.SUPER_ADMIN,
    ROLES.INSTITUTION_ADMIN,
    ROLES.TUTOR
]);

class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.name = 'HttpError';
        this.statusCode = statusCode;
    }
}

const roleOf = (requester) => Number(requester?.role);
const isSuperAdmin = (requester) => roleOf(requester) === ROLES.SUPER_ADMIN;
const isInstitutionEditor = (requester) => [ROLES.INSTITUTION_ADMIN, ROLES.TUTOR].includes(roleOf(requester));

const requireRole = (requester, allowedRoles) => {
    if (!requester?.user_mail) {
        throw new HttpError(401, 'Authentication is required.');
    }
    if (!allowedRoles.includes(roleOf(requester))) {
        throw new HttpError(403, 'You do not have permission to perform this action.');
    }
};

const requireInstitution = (requester) => {
    if (!requester?.centre_id) {
        throw new HttpError(403, 'Your account is not linked to an institution.');
    }
    return requester.centre_id;
};

const canEditOwnedEntity = (requester, ownerScope, ownerCentreId) => {
    if (isSuperAdmin(requester)) return true;
    return isInstitutionEditor(requester)
        && ownerScope === 'institution'
        && Boolean(requester.centre_id)
        && String(ownerCentreId) === String(requester.centre_id);
};

module.exports = {
    ROLES,
    COURSE_EDITOR_ROLES,
    HttpError,
    roleOf,
    isSuperAdmin,
    isInstitutionEditor,
    requireRole,
    requireInstitution,
    canEditOwnedEntity
};
