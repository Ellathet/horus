import express, { type Request, type Response } from 'express'
import vision from '@google-cloud/vision'
import multer from 'multer'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import { convertPageToPGJ } from '../utils/pdf'

const upload = multer({})

const router = express.Router()

const document: {
  rawText?: string
  factsDescription?: string
  legalGrounds?: string
  suggestedStrategy?: string
} = {}

router.get('/', (req: Request, res: Response) => {
  res.render('index', {
    document
  })
})

router.post('/', upload.single('pdf'), async (req: Request, res: Response) => {
  const client = new vision.ImageAnnotatorClient({
    keyFilename: path.join(__dirname, '../../google-key.json')
  })

  const pdf = req.file
  const TMP_PATH = path.join(__dirname, '../../tmp/')

  if (pdf === undefined) {
    return res.status(400).send('Por favor suba um .pdf')
  }

  if (!(pdf.originalname.match(/\.(pdf)$/i))) {
    return res.status(400).send('Please upload a PDF file.')
  }

  const folderName = crypto.randomUUID()
  await fs.promises.mkdir(TMP_PATH + folderName)
  await fs.promises.mkdir(TMP_PATH + folderName + '/pdf')
  const fileName = '/pdf/document.pdf'
  await fs.promises.writeFile(TMP_PATH + folderName + fileName, pdf.buffer)

  await convertPageToPGJ('.', path.join(TMP_PATH, folderName, fileName))

  const texts = await Promise.all(
    fs.readdirSync(path.join(TMP_PATH, folderName))
      .filter(f => f.endsWith('jpg'))
      .map(async (f) => {
        return await client
          .textDetection(TMP_PATH + folderName + '/' + f)
          .then((results) => {
            const detections = results[0].textAnnotations
            if (detections) {
              return detections.map(a => a.description).join(' ')
            }
          })
          .catch((err) => {
            console.error(err)
          })
      })
  )

  document.rawText = texts.join(' ')
  document.factsDescription = texts.join(' ')
  document.legalGrounds = texts.join(' ')
  document.suggestedStrategy = texts.join(' ')

  res.redirect('/')
})

export default router
