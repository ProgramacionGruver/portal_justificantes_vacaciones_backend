import { transporter } from '../config/mail.js'

export const enviarCorreo = async (participantes, titulo, mensaje, copias = [], copiasOcultas = []) => {
    const mailOptions = {
      from: 's.gruver@gruver.mx',
      to: participantes,
      subject: titulo,
      cc: copias.length ? copias : undefined,
      bcc: copiasOcultas.length ? copiasOcultas : undefined,
      html: mensaje,
    }
  
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject({ errorInfo: error, mensaje: `Mensaje NO enviado ${error}`, enviado: false })
        } else {
          resolve({ errorInfo: info.response, mensaje: `Mensaje enviado ${info.response}`, enviado: true })
        }
      })
    })
  }