import path from 'path'
import multer from 'multer'

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join('/recursos/documentos/portalJustificantes/incapacidades'))
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
})