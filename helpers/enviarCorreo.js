import { transporter } from '../config/mail.js'

export const enviarCorreo = async ( participantes, titulo, mensaje, copias, copiasOcultas) => {

    const mailOptions = {
        from: 'sgruver@gruver.mx',
        to: participantes,
        subject: titulo,
        cc: copias,
        bcc: copiasOcultas,
        html: mensaje,
    }
    transporter.sendMail(mailOptions, (error, info) =>{
        return error ? {errorInfo: error, mensaje: `Nensaje NO enviado ${error}`, enviado: false} : {errorInfo: info.response, mensaje: `Mensaje enviado ${info.response}`, enviado: true}
      })

}
