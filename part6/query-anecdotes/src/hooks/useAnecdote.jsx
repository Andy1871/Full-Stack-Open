import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, createAnecdote, updateAnecdote } from "../requests";
import useNotify from "./useNotify";

export const useAnecdotes = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotify();

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
  });

  // new anecdote
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      showNotification(`New anecdote "${newAnecdote.content}" created`);
    },
    onError: () => {
      showNotification("too short anecdote, must have length 5 or more");
    },
  });

  // update anecdote
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      showNotification(`anecdote '${updatedAnecdote.content}' voted`);
    },
  });

  //return an object of each thing
  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote: (content) => newAnecdoteMutation.mutate({ content }),
    handleVote: (anecdote) =>
      updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 }),
  };
};
