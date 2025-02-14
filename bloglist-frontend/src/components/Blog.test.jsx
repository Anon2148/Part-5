import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, vi } from 'vitest'

describe('<Blog />', () => {
  let container
  let mockHandler
  const blog = {
    title: 'new blog',
    author: 'author',
    url: 'url',
    likes: 0,
    user: { username: 'root' },
  }

  beforeEach(() => {
    mockHandler = vi.fn()
    container = render(<Blog blog={blog} addLike={mockHandler} />).container
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
})

test
