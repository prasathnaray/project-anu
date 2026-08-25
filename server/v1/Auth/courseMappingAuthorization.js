const { ROLES } = require('./authorization');

const roleOf = (requester) => Number(requester?.role);

const courseMappingOwnership = (requester) => {
    const role = roleOf(requester);
    if (!requester?.user_mail) return null;

    if (role === ROLES.SUPER_ADMIN) {
        return {
            ownerScope: 'super_admin',
            ownerCentreId: null
        };
    }

    if (role === ROLES.INSTITUTION_ADMIN && requester.centre_id) {
        return {
            ownerScope: 'institution',
            ownerCentreId: requester.centre_id
        };
    }

    return null;
};

const courseMappingReadScope = (requester, alias = 'cm', parameterNumber = 1) => {
    const role = roleOf(requester);
    if (!requester?.user_mail) return null;

    if (role === ROLES.SUPER_ADMIN) {
        return {
            clause: `${alias}.owner_scope = 'super_admin' AND ${alias}.created_by = $${parameterNumber}`,
            params: [requester.user_mail]
        };
    }

    if ([ROLES.INSTITUTION_ADMIN, ROLES.TUTOR, ROLES.TRAINEE].includes(role) && requester.centre_id) {
        return {
            clause: `${alias}.owner_scope = 'institution' AND ${alias}.owner_centre_id = $${parameterNumber}`,
            params: [requester.centre_id]
        };
    }

    return null;
};

module.exports = { courseMappingOwnership, courseMappingReadScope };
