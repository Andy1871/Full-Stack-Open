import { useEffect } from "react";
import { useAnecdotes, useAnecdotesActions } from "../store";
import { useNotificationActions } from "../notificationStore";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const { vote, initialize, remove } = useAnecdotesActions();
  const { setNotification } = useNotificationActions();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes);

  const handleVote = (anecdote) => {
    vote(anecdote.id);
    setNotification(`you voted '${anecdote.content}'`);
  };

  const handleDelete = (anecdote) => {
    remove(anecdote.id);
    setNotification(`Anecdote '${anecdote.content}' successfully deleted`);
  };

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => handleDelete(anecdote)}>delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
