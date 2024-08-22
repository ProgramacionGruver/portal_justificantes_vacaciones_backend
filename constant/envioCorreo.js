import { enviarCorreoErrores } from '../helpers/correosErrores.js'
import { apiCorreos } from '../boot/axiosCorreos.js'

export const enviarCorreo = async (destinatarios, copia, copiaOculta, asunto, html, adjuntos) => {
    try {
      await apiCorreos.post(`/envio/correo`, { destinatarios, copia, copiaOculta, asunto, html, adjuntos}) 
    } catch (error) {
      await enviarCorreoErrores(`[Error al enviar correos pendientes / [${error}]`)
    }
}