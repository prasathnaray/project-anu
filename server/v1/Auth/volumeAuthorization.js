const { ROLES, COURSE_EDITOR_ROLES } = require('./authorization');

const roleOf = (requester) => Number(requester?.role);

const canManageVolume = (requester, volume) => {
    const role = roleOf(requester);
    if (!requester?.user_mail || !COURSE_EDITOR_ROLES.includes(role) || !volume) return false;
    if (String(volume.added_by || '') === String(requester.user_mail)) return true;

    return role === ROLES.INSTITUTION_ADMIN
        && Number(volume.uploader_role) === ROLES.TUTOR
        && Boolean(requester.centre_id)
        && String(volume.owner_centre_id || '') === String(requester.centre_id);
};

const volumeAccessScope = (requester, alias = 'v', parameterNumber = 1) => {
    const role = roleOf(requester);
    if (!requester?.user_mail || !COURSE_EDITOR_ROLES.includes(role)) return null;

    const ownClause = `${alias}.added_by = $${parameterNumber}`;
    if (role !== ROLES.INSTITUTION_ADMIN) {
        return { clause: ownClause, params: [requester.user_mail] };
    }

    if (!requester.centre_id) {
        return { clause: ownClause, params: [requester.user_mail] };
    }

    return {
        clause: `(${ownClause} OR (${alias}.uploader_role = $${parameterNumber + 1} AND ${alias}.owner_scope = 'institution' AND ${alias}.owner_centre_id = $${parameterNumber + 2}))`,
        params: [requester.user_mail, ROLES.TUTOR, requester.centre_id]
    };
};

module.exports = { canManageVolume, volumeAccessScope };
