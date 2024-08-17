import jwt from 'jwt-simple'
import dotenv from 'dotenv'
dotenv.config( { path: '.env' } )


export const encryptarObjeto = async (objeto) => {
    return jwt.encode(objeto, process.env.DB_SECRET) // Codificar el objeto en un token JWT
}

export const desEncryptarObjeto = (encryptedText)  => {
   return jwt.decode(encryptedText, process.env.DB_SECRET)
  }
