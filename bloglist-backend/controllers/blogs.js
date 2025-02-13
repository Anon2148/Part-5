const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  if (!body.title || !body.author || !body.url || !user) {
    return response.status(400).json({ error: 'malformed request' })
  } else if (!body.likes) {
    body.likes = 0
  }

  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes,
    user: user.id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  const user = request.user

  if (blog.user.toString() === user.id.toString()) {
    await blog.deleteOne()
    return response.status(204).end()
  } else {
    return response.status(401).json({
      error: 'you are trying to delete a blog that does not belong to you',
    })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const user = request.user

  if (!body.title || !body.url || !body.author || !user) {
    return response.status(400).json({ error: 'malformed request' })
  }

  const blog = {
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes || 0,
    user: body.user,
  }
  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(204).end()
})

module.exports = blogsRouter
