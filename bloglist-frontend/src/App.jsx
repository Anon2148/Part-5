import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import NewBlogForm from './components/NewBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => {
      setBlogs(initialBlogs.sort((blog1, blog2) => blog1.likes <= blog2.likes))
    })
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const userData = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(userData))
      blogService.setToken(userData.token)
      setUser(userData)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          data-testid="username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          data-testid="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const logoutUser = () => {
    setUser(null)
    window.localStorage.clear()
  }

  const userBlogs = () => {
    return (
      <div>
        <p>
          {user.name} logged-in<button onClick={logoutUser}>logout</button>
        </p>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <NewBlogForm createBlog={createBlog} />
        </Togglable>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            addLike={addLike}
            removeBlog={removeBlog}
          />
        ))}
      </div>
    )
  }

  const removeBlog = (blogObject) => {
    const response = blogService.remove(blogObject.id).then(() => {
      const updatedBlogs = blogs.filter((blog) => blog.id !== blogObject.id)
      setBlogs(updatedBlogs)
    })
    if (response.status === (20)[0 - 9]) {
      const message =
        'the blog ' +
        blogObject.title +
        ' by ' +
        blogObject.author +
        ' was removed'
      setErrorMessage(message)
    } else {
      setErrorMessage('something went wrong')
    }
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const addLike = (blogObject, id) => {
    const response = blogService.update(id, blogObject).then(() => {
      const updatedBlogs = blogs.map((blog) =>
        blog.id === id ? { ...blog, likes: blogObject.likes } : blog
      )
      setBlogs(updatedBlogs)
    })
    if (response.status === (20)[0 - 9]) {
      const message =
        'the blog ' +
        blogObject.title +
        ' by ' +
        blogObject.author +
        ' was updated'
      setErrorMessage(message)
    } else {
      setErrorMessage('something went wrong')
    }
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const createBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const response = blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog))
    })
    if (response.status === (20)[0 - 9]) {
      const message =
        'a new blog ' + blogObject.title + ' by ' + blogObject.author + ' added'
      setErrorMessage(message)
    } else {
      setErrorMessage('something went wrong')
    }
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      {user === null ? loginForm() : userBlogs()}
    </div>
  )
}

export default App
