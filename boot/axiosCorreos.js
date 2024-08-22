import axios from 'axios'

const apiCorreos = axios.create({ baseURL: 'https://backend.gruver.com.mx/correos/api/'})

export { apiCorreos }
