import { create } from "zustand";
import anecdoteService from "./services/anecdotes";

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: "",
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll();
      set(() => ({ anecdotes }));
    },
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content);
      set((state) => ({ anecdotes: state.anecdotes.concat(newAnecdote) }));
    },
    remove: async (id) => {
      await anecdoteService.remove(id);
      set((state) => ({
        anecdotes: state.anecdotes.filter((a) => a.id !== id),
      }));
    },
    vote: async (id) => {
      const anecdote = get().anecdotes.find((a) => a.id === id);
      const update = await anecdoteService.update(id, {
        ...anecdote,
        votes: anecdote.votes + 1,
      });
      set((state) => ({
        anecdotes: state.anecdotes.map((a) => (a.id === id ? update : a)),
      }));
    },
    setFilter: (value) => set(() => ({ filter: value })),
  },
}));

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes);
  const filter = useAnecdoteStore((state) => state.filter);

  return anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase()),
  );
};
export const useFilter = () => useAnecdoteStore((state) => state.filter);
export const useAnecdotesActions = () =>
  useAnecdoteStore((state) => state.actions);
