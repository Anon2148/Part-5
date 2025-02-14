import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect } from 'vitest'

test('initial renders show only blog`s title and blog`s author', () => {
  const blog = {
    title: 'new blog',
    author: 'author',
    url: 'url',
    likes: 0,
    user: { username: 'root' },
  }

  const container = render(<Blog blog={blog} />).container

  const title = screen.findByText('new blog')
  const author = screen.findByText('author')
  const hiddenDiv = container.querySelector('.hiddenInfo')

  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(hiddenDiv).toHaveStyle('display: none')
})
