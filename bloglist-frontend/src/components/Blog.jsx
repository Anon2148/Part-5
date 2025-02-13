import { useState } from 'react'

const Blog = ({ blog }) => {
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
        <p>likes{' ' + blog.likes}</p>
        {blog.user ? <p>{blog.user.username}</p> : ''}
      </div>
    </div>
  )
}

export default Blog
