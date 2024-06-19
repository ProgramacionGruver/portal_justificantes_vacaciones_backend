import { transporter } from '../config/mail.js'

export const enviarCorreo = async ( buffer, nombreArchivo ) => {

    const mailOptions = {
        from: 'sgruver@gruver.mx',
        to: ['jpedroza@gruver.mx'],
        subject: 'subject',
        html: 'Buenas tardes, adjunto los candidatos encontrados en el siguiente archivo, para mas información consultar dar click aquí <a href="http://localhost:9000/#">Click<a/>',
        attachments: [
            {
                filename: nombreArchivo,
                content: buffer,
                contentType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        ],
    }
    await transporter.sendMail(mailOptions, ( error, info ) => {
        if ( error ) {
            return console.log( error )
        }
        console.log(`Mensaje enviado ${ info.response }`)
    })

}
