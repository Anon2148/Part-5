import { useState } from 'react'

const Blog = ({ blog, addLike }) => {
  const [blogVisible, setBlogVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const showWhenVisible = { display: blogVisible ? '' : 'none' }

  const toggleVisibility = () => {
    setBlogVisible(!blogVisible)
  }

  const like = () => {
    addLike(
      {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user.id,
      },
      blog.id
    )
  }

  const remove = () => {}

  return (
    <div style={blogStyle}>
      <div>
        <p>
          {blog.title} of {blog.author}{' '}
          <button onClick={toggleVisibility}>
            {blogVisible ? 'hide' : 'view'}
          </button>
        </p>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>
          likes{' ' + blog.likes} <button onClick={like}>like</button>
        </p>
        <p>{blog.user.username}</p>
        <button onClick={remove}>remove</button>
      </div>
    </div>
  )
}

export default Blog
