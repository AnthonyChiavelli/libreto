import dotenv from 'dotenv'
import express from 'express'
import 'reflect-metadata'
import path from 'path'
import { SERVER_PORT } from 'consts'
import { initializeDB } from 'database'
import { Db } from 'mongodb'
import { ObjectId } from 'mongodb'
import { BlogPostModel } from 'model'
import bodyParser from 'body-parser'
import * as Logger from 'loglevel'
const API_PREFIX = '/api/'

dotenv.config()
const app = express()
app.use(bodyParser.json())
Logger.setLevel('info')

app.listen(SERVER_PORT, async () => {
  // Initialize DB
  Logger.info(`Server running on port ${SERVER_PORT}`)
  try {
    const dbClient: Db = await initializeDB()
    Logger.info(`Connected to database`)
    app.emit('dbReady', dbClient)
  } catch (e) {
    Logger.error('Unable to connect to database')
    Logger.error(e)
    defineBundleEndpoints()
  }
})

// API Endpoints
app.on('dbReady', (): void => {
  app.get(API_PREFIX + 'posts/', async function (request, response) {
    const query: { [k: string]: any } = {}
    if (request.query.status === 'draft') {
      query['published'] = false
    }
    if (request.query.status === 'published') {
      query['published'] = true
    }
    if (request.query.category) {
      query['category'] = request.query.category
    }
    const posts = await BlogPostModel.find(query, { sort: { createdAt: -1 } })
    response.send(posts.map((p) => p.toJson()))
  })

  app.patch(API_PREFIX + 'posts/:id', async function (request, response) {
    const post = await BlogPostModel.findOne({ _id: new ObjectId(request.params.id) })
    if (!post) {
      response.sendStatus(404)
      return
    }
    const update: { [k: string]: any } = {
      title: request.body.title,
      body: request.body.body,
      published: request.body.published,
      blurb: request.body.blurb,
      slug: request.body.slug,
    }
    if (!post.published && request.body.published) update.publishedAt = new Date()
    post.patch(update)
    post.save()
    response.status(201).send((await post.reload()).toJson())
  })

  app.post(API_PREFIX + 'posts/', async function (request, response) {
    const post = new BlogPostModel()
    const update = request.body
    if (request.body.published) update.publishedAt = new Date()
    post.patch(update)
    try {
      await post.save()
      response.status(201).send(post.toJson())
    } catch (e) {
      response.status(422).send({ error: e.message, message: 'Update failed' })
    }
  })

  app.get(API_PREFIX + 'posts/:slug', async function (request, response) {
    const post = await BlogPostModel.findOne({ slug: request.params.slug })
    response.send(post ? post.toJson() : undefined)
  })

  app.get(API_PREFIX + 'adminStatus/', async function (request, response) {
    const isAdmin = request.query.token === process.env.ADMIN_TOKEN
    response.send({ isAdmin: isAdmin })
  })

  app.get(API_PREFIX + '*', async function (request, response) {
    response.sendStatus(404)
  })

  defineBundleEndpoints()
})

const defineBundleEndpoints = () => {
  // Serve the js bundle at its path and the HTML bundle at every other path
  app.get('*/bundle.js', function (req, res) {
    res.sendFile(path.resolve('..', 'dist', 'bundle.js'))
  })
  app.get('*', function (request, response) {
    response.sendFile(path.resolve('..', 'dist', 'index.html'))
  })
}
