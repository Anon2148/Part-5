import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, vi } from 'vitest'
import NewBlogForm from './NewBlogForm'
import Togglable from './Togglable'

describe('<Blog />', () => {
  let container
  let mockHandler
  let newBlogMockHandler
  const blog = {
    title: 'new blog',
    author: 'author',
    url: 'url',
    likes: 0,
    user: { username: 'root' },
  }

  beforeEach(() => {
    mockHandler = vi.fn()
    newBlogMockHandler = vi.fn()
    container = render(
      <>
        <Togglable buttonLabel="new blog">
          <NewBlogForm createBlog={newBlogMockHandler} />
        </Togglable>
        <Blog blog={blog} addLike={mockHandler} />
      </>
    ).container
  })

  test('at start only blog`s title and blog`s author are displayed', async () => {
    const title = screen.findByText('new blog')
    const author = screen.findByText('author')
    const hiddenDiv = container.querySelector('.hiddenInfo')

    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(hiddenDiv).toHaveStyle('display: none')
  })

  test('hidden content is displayed after pressing the button controlling', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    const hiddenDiv = container.querySelector('.hiddenInfo')
    await user.click(button)
    expect(hiddenDiv).not.toHaveStyle('display: none')
  })

  test('hidden content is displayed after pressing the button controlling', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    const likeButton = screen.getByText('like')

    await user.click(viewButton)
    await user.dblClick(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('create a blog should call the function passed as a parameter to the object', async () => {
    const user = userEvent.setup()
    const newBlogButton = screen.getByText('new blog')
    const createBlogButton = screen.getByText('create')
    const inputTitle = container.querySelector("input[name='title']")
    const inputAuthor = container.querySelector("input[name='author']")
    const inputUrl = container.querySelector("input[name='url']")

    await user.click(newBlogButton)
    await user.type(inputTitle, 'test title')
    await user.type(inputAuthor, 'test author')
    await user.type(inputUrl, 'test url')
    await user.click(createBlogButton)

    console.log(newBlogMockHandler.mock.calls)

    expect(newBlogMockHandler.mock.calls).toHaveLength(1)
    expect(newBlogMockHandler.mock.calls[0][0]).toMatchObject({
      title: 'test title',
      author: 'test author',
      url: 'test url',
    })
  })
})

test
