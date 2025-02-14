import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

describe('<Blog />', () => {
  let container
  const blog = {
    title: 'new blog',
    author: 'author',
    url: 'url',
    likes: 0,
    user: { username: 'root' },
  }

  beforeEach(() => {
    container = render(<Blog blog={blog} />).container
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
})

test
