const STORAGE_KEY = "loggedBlogappUser";

export const getUser = () => {
  const userJSON = window.localStorage.getItem(STORAGE_KEY);
  return userJSON ? JSON.parse(userJSON) : null;
};

export const saveUser = (user) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const removeUser = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};

export default { getUser, saveUser, removeUser };