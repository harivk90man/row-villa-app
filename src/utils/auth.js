export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isBoardMember = () => {
  const user = getUser();
  return user?.isBoardMember === true;
};

export const isLoggedIn = () => {
  return !!getUser();
};

export const logout = () => {
  localStorage.removeItem('user');
  window.location.href = '/login';
};
