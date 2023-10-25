import 'dotenv/config'
import express from 'express'
import mainController from './controllers/main-controller'
import path from 'path'
import { getEnv } from './utils/env'

const app = express()
const port = getEnv<number>('NODE_PORT', 3000)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/', mainController)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
