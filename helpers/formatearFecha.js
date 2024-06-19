import dayjs from 'dayjs'
// import { es } from 'dayjs/locale/es.js'

export const formatearFecha = (stringFecha) => dayjs(stringFecha).locale('es').format('DD/MM/YYYY')