const { HttpError, ROLES, requireInstitution, requireRole } = require('../Auth/authorization');

const requirePublisher = (requester) => {
  requireRole(requester, [ROLES.TRAINEE]);
  return requireInstitution(requester);
};

const requireViewer = (requester) => {
  requireRole(requester, [ROLES.INSTITUTION_ADMIN]);
  return requireInstitution(requester);
};

const traineeUserId = (peopleId) => {
  if (!peopleId) throw new HttpError(409, 'Your trainee profile does not have a streaming identifier.');
  return `trainee:${peopleId}`;
};

module.exports = { requirePublisher, requireViewer, traineeUserId };
