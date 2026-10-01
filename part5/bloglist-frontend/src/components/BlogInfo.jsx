import { useParams, useNavigate } from "react-router-dom";

const BlogInfo = ({ blog, updateBlog, deleteBlog, user }) => {
  const id = useParams().id;
  const navigate = useNavigate();

  if (!blog) {
    return null;
  }

  const likeBlog = () => {
    updateBlog(blog.id, {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id,
    });
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete blog "${blog.title}"?`)) {
      await deleteBlog(id);
      navigate("/");
    }
  };

  return (
    <div className="blog">
      <h2>
        {blog.author}: {blog.title}
      </h2>{" "}
      <>
        <p>
          <a href={blog.url} target="_blank">
            {blog.url}
          </a>
        </p>
        <span>
          likes: {blog.likes}{" "}
          {user && (
            <button className="button" onClick={likeBlog}>
              like
            </button>
          )}
        </span>
        <p>Added by {blog.user?.name ?? "unknown"}</p>
        {user && user.username === blog.user?.username && (
          <button className="delete" onClick={handleDelete}>
            remove
          </button>
        )}
      </>
    </div>
  );
};

export default BlogInfo;
