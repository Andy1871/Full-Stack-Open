import { Link } from "react-router-dom";

const BlogList = ({ blogs }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <>
      <h2>blogs</h2>

      <ul>
        {sortedBlogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/${blog.id}`}>{blog.title}</Link> by {blog.author}
          </li>
        ))}
      </ul>
    </>
  );
};

export default BlogList;
