import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    console.log('logged')
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => {
      setBlogs(initialBlogs)
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
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
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
        {newBlogForm()}
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    )
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()

    try {
      const newBlog = {
        title,
        author,
        url,
      }

      const response = await blogService.create(newBlog)
      if (response.status === (20)[0 - 9]) {
        const message = 'a new blog ' + title + ' by ' + author + ' added'
        setErrorMessage(message)
      } else {
        setErrorMessage('something went wrong')
      }
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      setErrorMessage('All fields should be filled')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const newBlogForm = () => {
    return (
      <div>
        <h2>create new</h2>
        <form onSubmit={handleNewBlog}>
          <div>
            title:
            <input
              type="text"
              onChange={({ target }) => setTitle(target.value)}
              value={title}
              name="title"
            ></input>
          </div>
          <div>
            author:
            <input
              type="text"
              onChange={({ target }) => setAuthor(target.value)}
              value={author}
              name="author"
            ></input>
          </div>
          <div>
            url:
            <input
              type="text"
              onChange={({ target }) => setUrl(target.value)}
              value={url}
              name="url"
            ></input>
          </div>
          <button type="submit">create</button>
        </form>
      </div>
    )
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
