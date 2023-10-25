import express, { type Request, type Response } from 'express'

import items from '../models/data'

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.render('index', { items })
})

export default router
