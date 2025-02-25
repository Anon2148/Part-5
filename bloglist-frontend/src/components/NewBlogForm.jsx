import { useState } from 'react'

const NewBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            data-testid="title"
            onChange={({ target }) => setTitle(target.value)}
            value={title}
            name="title"
          ></input>
        </div>
        <div>
          author:
          <input
            type="text"
            data-testid="author"
            onChange={({ target }) => setAuthor(target.value)}
            value={author}
            name="author"
          ></input>
        </div>
        <div>
          url:
          <input
            type="text"
            data-testid="url"
            onChange={({ target }) => setUrl(target.value)}
            value={url}
            name="url"
          ></input>
        </div>
        <button type="submit" name="create">
          create
        </button>
      </form>
    </div>
  )
}

export default NewBlogForm
