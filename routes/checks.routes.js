import express from 'express'
import { obtenerChecks } from '../controllers/checksController.js'

const router = express.Router()

router.post('/obtenerAsistencias', obtenerChecks)




export default router