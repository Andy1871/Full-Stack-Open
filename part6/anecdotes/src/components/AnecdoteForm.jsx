import { useAnecdotesActions } from "../store";
import { useNotificationActions } from "../notificationStore";

const AnecdoteForm = () => {
  const { add } = useAnecdotesActions();
  const { setNotification } = useNotificationActions();

  const addAnecdote = async (e) => {
    e.preventDefault();
    const content = e.target.anecdote.value;
    await add(content);
    setNotification(`New anecdote: '${content}' successfully added`);
    e.target.reset();
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input data-testid="new" name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
