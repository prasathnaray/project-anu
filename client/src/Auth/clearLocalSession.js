export default function clearLocalSession() {
  ['user_token', 'isVr', 'loginSource', 'device', 'os', 'people_id'].forEach(
    (key) => localStorage.removeItem(key)
  );
  sessionStorage.removeItem('user_name');
}
