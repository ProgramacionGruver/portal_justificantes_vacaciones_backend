import { obtenerResultadosDiarios } from "../controllers/turnosDiariosController.js"
import { obtenerTurnoEmpleado } from "../controllers/turnosController.js" 
import { enviarCorreoErrores } from "./correosErrores.js"

export const manejoRutinaObtenerTurnoDiario = async ( intentosRestantes = 3 ) =>{

    if (intentosRestantes === 0) {
        await enviarCorreoErrores('No se pudo obtener los CHECKS DIARIOS después de 3 intentos.')
        return
    }
    try {
      await obtenerResultadosDiarios()
      return
    } catch (error) {
        manejoRutinaObtenerTurnoDiario(intentosRestantes - 1)
    }
}

export const menejoRutinaObtenerTurnoEmpleado = async ( intentosRestantes = 3 ) =>{

    if (intentosRestantes === 0) {
        await enviarCorreoErrores('No se pudo obtener los TURNOS después de 3 intentos.')
        return
    }
    try {
      await obtenerTurnoEmpleado()
      return
    } catch (error) {
        menejoRutinaObtenerTurnoEmpleado(intentosRestantes - 1)
    }
}