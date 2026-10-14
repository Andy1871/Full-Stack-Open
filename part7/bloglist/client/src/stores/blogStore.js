import { create } from "zustand";
import blogService from "../services/blogs";

const useBlogStore = create((set, get) => ({
  blogs: [],
  loaded: false,
  actions: {
    initialize: async () => {
      const blogs = await blogService.getAll();
      set(() => ({ blogs, loaded: true }));
    },
    add: async (blogObject) => {
      const newBlog = await blogService.create(blogObject);
      set((state) => ({ blogs: state.blogs.concat(newBlog) }));
      return newBlog;
    },
    like: async (id) => {
      const blog = get().blogs.find((b) => b.id === id);
      const update = await blogService.update(id, {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user?.id,
      });
      set((state) => ({
        blogs: state.blogs.map((b) => (b.id === id ? update : b)),
      }));
    },
    remove: async (id) => {
      await blogService.remove(id);
      set((state) => ({
        blogs: state.blogs.filter((b) => b.id !== id),
      }));
    },
    addComment: async (id, comment) => {
      const update = await blogService.addComment(id, comment)
      set((state) => ({
        blogs: state.blogs.map((b) => (b.id === id ? update : b)),
      }));
    }
  },
}));

export const useBlogs = () => useBlogStore((state) => state.blogs);
export const useBlogActions = () => useBlogStore((state) => state.actions);
export const useBlogsLoaded = () => useBlogStore((state) => state.loaded);
