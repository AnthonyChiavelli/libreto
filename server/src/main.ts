import dotenv from 'dotenv'
import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import 'reflect-metadata'
import path from 'path'
import { initializeDB } from 'database'
import { Db } from 'mongodb'
import bodyParser from 'body-parser'
import translate from 'spapi'
import * as Logger from 'loglevel'
import { WordResult } from 'spapi/dictionary'
import { SavedWord } from 'model'
const API_PREFIX = '/api/'

dotenv.config()
const app = express()
app.use(bodyParser.json())
Logger.setLevel('info')

app.listen(process.env.SERVER_PORT, async () => {
  // Initialize DB
  Logger.info(`Server running on port ${process.env.SERVER_PORT}`)
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
  app.post(API_PREFIX + 'lookup-word/', async function (request, response) {
    try {
      translate.translate(request.body.word).then((res: Array<WordResult>) => {
        response.send(res.map((r) => ({ id: uuidv4(), ...r })))
      })
    } catch {
      response.status(400).send({ message: 'Word not found' })
    }
  })
  app.get(API_PREFIX + 'wordbank/', async function (request, response) {
    const res = await SavedWord.fetchAll()
    response.send(res)
  })

  app.post(API_PREFIX + 'wordbank/', async function (request, response) {
    const word = new SavedWord(request.body.word, request.body.definitions, request.body.notes)
    try {
      const res = await word.save()
      const inserted = await SavedWord.fetchOne(res.insertedId)
      response.status(201).send(inserted)
    } catch {
      response.status(400).send({ message: 'Unable to add word to word bank' })
    }
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
