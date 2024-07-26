import { transporter } from '../config/mail.js'

export const enviarCorreoErrores = async ( tipoError ) => {

    const mailOptions = {
        from: 's.gruver@gruver.mx',
        to: ['monitor_rutinas@gruver.mx'],
        subject: 'Error en bot JUSTIFICANTES',
        html: tipoError,
    }
    await transporter.sendMail(mailOptions, ( error, info ) => {
        if ( error ) {
            return console.log( error )
        }
        console.log(`Mensaje enviado ${ info.response }`)
    })

}
