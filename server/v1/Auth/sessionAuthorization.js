const canManageSessions = (requester, target) => {
  if (!requester?.user_mail || !target?.user_email) return false;
  if (requester.user_mail === target.user_email) return true;
  const role = Number(requester.role);
  if (role === 99) return true;
  return role === 101 && Boolean(requester.centre_id)
    && String(requester.centre_id) === String(target.centre_id);
};

module.exports = { canManageSessions };
