import { create } from "zustand";
import blogService from "../services/blogs";
import loginService from "../services/login";
import persistentUser from "../services/persistentUser";

const initialUser = persistentUser.getUser();
if (initialUser) {
  blogService.setToken(initialUser.token);
}

const useUserStore = create((set) => ({
  user: initialUser,
  actions: {
    login: async (credentials) => {
      const newUser = await loginService.login(credentials);
      persistentUser.saveUser(newUser);
      blogService.setToken(newUser.token);
      set({ user: newUser });
    },
    logout: () => {
      set({ user: null });
      persistentUser.removeUser();
      blogService.setToken(null);
    },
  },
}));

export const useUser = () => useUserStore((state) => state.user);
export const useUserActions = () => useUserStore((state) => state.actions);
