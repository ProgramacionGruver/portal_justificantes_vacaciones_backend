import dayjs from 'dayjs'
import 'dayjs/locale/es.js'

dayjs.locale('es')

export const formatearFecha = (stringFecha) => dayjs(stringFecha).locale('es').format('DD/MM/YYYY')

export const formatearFechaCorreo = (stringFecha) => dayjs(stringFecha).format('DD [de] MMMM [del] YYYY')
